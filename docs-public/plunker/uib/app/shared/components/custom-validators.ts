///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { AbstractControl } from '@angular/forms';

export class CustomValidators {

    public static mailFormat(control: AbstractControl): ValidationResult {
        const EMAIL_REGEXP: RegExp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

        if (control.value !== '' && !EMAIL_REGEXP.test(control.value)) {
            return {
                'incorrectMail': true
            };
        }

        return null;
    }

    public static urlFormat(control: AbstractControl): ValidationResult {
        const URL_REGEXP: RegExp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/i; /* tslint:disable-line */

        if (control.value !== '' && !URL_REGEXP.test(control.value)) {
            return {
                'invalidUrl': true
            };
        }

        return null;
    }
}

interface ValidationResult {
    [key: string]: boolean;
}
