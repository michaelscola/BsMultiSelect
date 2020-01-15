import {OptionsAdapterElement} from './OptionsAdapters';
import {addClass, removeClass, setStyle} from './ToolsDom';

function updateIsValid(picksElement, isValid, isInvalid){
    if (isValid)
        addClass(picksElement,'is-valid');
    else
        removeClass(picksElement,'is-valid');
    
    if (isInvalid)
        addClass(picksElement,'is-invalid');
    else
        removeClass(picksElement,'is-invalid');
}


function updateSize(picksElement, size){
    if (size=="custom-select-lg"){
        addClass(picksElement,'form-control-lg');
        removeClass(picksElement,'form-control-sm');
    }
    else if (size=="custom-select-sm"){
        removeClass(picksElement,'form-control-lg');
        addClass(picksElement,'form-control-sm');
    }
    else{
        removeClass(picksElement,'form-control-lg');
        removeClass(picksElement,'form-control-sm');
    }
}

function updateSizeJs(picksElement, picksStyleLg, picksStyleSm, picksStyleDef, size){
    updateSize(picksElement, size);
    if (size=="custom-select-lg" || size=="input-group-lg"){
        setStyle(picksElement, picksStyleLg);
    } else if (size=="custom-select-sm" || size=="input-group-sm"){
        setStyle(picksElement, picksStyleSm);
    } else {
        setStyle(picksElement, picksStyleDef);
    }
}

function updateIsValidForAdapter(picksElement, optionsAdapter){
    updateIsValid(picksElement, optionsAdapter.getIsValid(), optionsAdapter.getIsInvalid())
}

function updateSizeForAdapter(picksElement, optionsAdapter){
    updateSize(picksElement, optionsAdapter.getSize())
}

function updateSizeJsForAdapter(picksElement, picksStyleLg, picksStyleSm, picksStyleDef, optionsAdapter){
    updateSizeJs(picksElement, picksStyleLg, picksStyleSm, picksStyleDef,  optionsAdapter.getSize())
}

export function createBsAppearance(picksElement, configuration, optionsAdapter){
    var value=null;
    var updateIsValid = () => updateIsValidForAdapter(picksElement, optionsAdapter);
    if (configuration.useCss){
        value= Object.create({
            updateIsValid,
            updateSize: () => updateSizeForAdapter(picksElement, optionsAdapter)
        });
    }else{
        const {picksStyleLg, picksStyleSm, picksStyleDef} = configuration;
        value= Object.create({
            updateIsValid,
            updateSize: () => updateSizeJsForAdapter(picksElement, 
                picksStyleLg, picksStyleSm, picksStyleDef, optionsAdapter)
        });
    }
    return value;
}

export function createBsOptionAdapter(configuration, selectElement, containerElement, trigger, closest){
    if (!configuration.label)
    {
        let formGroup = closest(selectElement, '.form-group');
        if (formGroup) {
            let label = formGroup.querySelector(`label[for="${selectElement.id}"]`);
            if (label) {   
                let forId = label.getAttribute('for');
                if (forId == selectElement.id) {
                    configuration.label = label;
                }
            }   
        }
    }
    var form = closest(selectElement, 'form');
    
    if (!configuration.getDisabled) {
        var fieldset = closest(selectElement, 'fieldset');
        if (fieldset) {
            configuration.getDisabled = () => selectElement.disabled || fieldset.disabled;
        }else{
            configuration.getDisabled = () => selectElement.disabled;
        }
    }

    if (!configuration.getSize) {
        configuration.getSize = function(){
            var value=null;
            if (selectElement.classList.contains('custom-select-lg') || selectElement.classList.contains('form-control-lg') )
                value='custom-select-lg';
            else if (selectElement.classList.contains('custom-select-sm')  || selectElement.classList.contains('form-control-sm')  )
                value='custom-select-sm';
            else if (containerElement && containerElement.classList.contains('input-group-lg'))
                value='input-group-lg';
            else if (containerElement && containerElement.classList.contains('input-group-sm'))
                value='input-group-sm';
            return value;
        }
    }
    if (!configuration.getIsValid) {
        configuration.getIsValid = function()
        { return selectElement.classList.contains('is-valid')}
    }
    if (!configuration.getIsInvalid) {
        configuration.getIsInvalid = function()
        { return selectElement.classList.contains('is-invalid')}
    }
    var optionsAdapter = OptionsAdapterElement(
        selectElement, 
        configuration.getDisabled, 
        configuration.getSize, 
        configuration.getIsValid, 
        configuration.getIsInvalid,
        trigger, 
        form);
    return optionsAdapter;
}