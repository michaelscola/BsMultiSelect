import Bs4Commons from "./Bs4Commons.es8";

class Bs4AdapterCss {

    constructor(jQuery, hiddenSelect, options) {
        const defaults = {
            containerClass: 'dashboardcode-bsmultiselect',
            dropDownMenuClass: 'dropdown-menu',
            dropDownItemClass: 'px-2',
            dropDownItemHoverClass: 'text-primary bg-light',
            selectedPanelClass: 'form-control',
            selectedPanelFocusClass : 'focus',
            selectedPanelReadonlyClass: 'disabled',
            selectedItemClass: 'badge',
            removeSelectedItemButtonClass: 'close',
            filterInputItemClass: '',
            filterInputClass: ''
        };
        this.options = jQuery.extend({}, defaults, options);
        this.jQuery=jQuery;
        this.hiddenSelect=hiddenSelect;
        this.bs4Commons = new Bs4Commons(jQuery, hiddenSelect, this.options.dropDownItemHoverClass);

    }

    Init($container, $selectedPanel, $filterInputItem, $filterInput, $dropDownMenu){
        $container.addClass(this.options.containerClass);
        $selectedPanel.addClass(this.options.selectedPanelClass);

        $dropDownMenu.addClass(this.options.dropDownMenuClass);
        $filterInputItem.addClass(this.options.filterInputItemClass)
        $filterInput.addClass(this.options.filterInputClass);

        let inputId = this.hiddenSelect.id;
        let $formGroup = this.jQuery(this.hiddenSelect).closest('.form-group');
        
        if ($formGroup.length == 1) {
            let $label = $formGroup.find(`label[for="${inputId}"]`);
            let f = $label.attr('for');
            let $filterInput = $selectedPanel.find('input');
            if (f == this.hiddenSelect.id) {
                let id = `${this.options.containerClass}-generated-filter-id-${this.hiddenSelect.id}`;
                $filterInput.attr('id', id);
                $label.attr('for', id);
            }
        }
    }

    UpdateIsValid($selectedPanel){
        let $hiddenSelect = this.jQuery(this.hiddenSelect);
        if ($hiddenSelect.hasClass("is-valid")){
            $selectedPanel.addClass("is-valid");
        }

        if ($hiddenSelect.hasClass("is-invalid")){
            $selectedPanel.addClass("is-invalid");
        }
    }

    Enable($selectedPanel, isEnabled){
        if(isEnabled){
            $selectedPanel.removeClass(this.options.selectedPanelReadonlyClass);
            $selectedPanel.find('BUTTON').prop("disabled", false).on();
        }
        else{
            $selectedPanel.addClass(this.options.selectedPanelReadonlyClass);
            $selectedPanel.find('BUTTON').prop("disabled", true).off();
        }
    }

    CreateDropDownItemContent($dropDownItem, optionId, itemText, isSelected){
        return this.bs4Commons.CreateDropDownItemContent($dropDownItem, optionId, itemText, isSelected, this.options.containerClass, this.options.dropDownItemClass);
    }

    CreateSelectedItemContent($selectedItem, itemText, removeSelectedItem, disabled){
        this.bs4Commons.CreateSelectedItemContent($selectedItem, itemText, removeSelectedItem, this.options.selectedItemClass, this.options.removeSelectedItemButtonClass, disabled);
    }

    
    Hover($dropDownItem, isHover){
        this.bs4Commons.Hover($dropDownItem, isHover);
    }

    FilterClick(event){
        return this.bs4Commons.FilterClick(event)
    }

    Focus($selectedPanel, isFocused){
        if (isFocused){
            $selectedPanel.addClass(this.options.selectedPanelFocusClass);
        }else{
            $selectedPanel.removeClass(this.options.selectedPanelFocusClass);
        }
    }
}

export default Bs4AdapterCss;
