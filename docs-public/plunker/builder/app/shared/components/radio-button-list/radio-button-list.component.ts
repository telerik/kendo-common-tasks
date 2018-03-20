///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Component, Input, Output } from '@angular/core';
import { KbInputBaseComponent } from './../input.base.component';

@Component({
    selector: 'kb-radio-button-list',
    template: require('./radio-button-list.component.html'),
    styles: [
        `
        .kb-radio-button-list {
            min-height: 24px;
            overflow: auto;
            padding: 0;
            list-style: none;
        }

        .kb-radio-button-list li {
            padding: 2px;
        }

        .kb-radio-button-list.-horizontal {
            display: flex;
            align-items: center;
        }

        .kb-radio-button-list.-horizontal li {
            white-space: nowrap;
        }

        .kb-radio-button-list.-horizontal li + li {
            margin-left: 10px;
        }
        `
    ]
})
export class KbRadioButtonListComponent extends KbInputBaseComponent {
    @Input() public name: string;
    @Input() public data: Array<any>;
    public style;

    public ngOnInit(): void {
        super.ngOnInit();

        this.style = this.getStyle();
    }

    set model(value: any) {
        super.setModel<any>(value);
    }

    @Input() get model(): any {
        return super.getModel<any>();
    }

    public changeHandler(event: any): void {
        const { value } = this.formGroup.controls[this.id];
        const model = this.config.valuePrimitive ? value[this.config.dataValueField] : value;
        super.updateModel<string>(model);
    }

    public shouldValidateComponent(): boolean {
        return false;
    }

    protected isChecked(item): boolean {
        if (!this.model) {
            return false;
        }

        const value = this.config.valuePrimitive ? this.model : this.model[this.config.dataValueField];
        return item[this.config.dataValueField] === value;
    }

    protected getInputId(index): string {
        return `${this.id}_${index}`;
    }

    protected getStyle() {
        const style = {};

        if (this.config.height) {
            style['height'] =  `${this.config.height}px`;
        }

        if (this.config.maxHeight) {
            style['max-height'] = `${this.config.maxHeight}px`;
        }

        return style;
    }
}
