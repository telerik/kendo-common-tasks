///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Pipe, PipeTransform } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';

/*
 * Replaces the format string placeholder with the provided value.
 * Usage:
 *   value | formatValue:format
 * Example:
 *   {{ 2 | formatValue:'{0:c}' }}
 *   formats to: $2
*/
@Pipe({name: 'formatValue'})
export class FormatValuePipe implements PipeTransform {
    constructor(public intl: IntlService) {
    }

    transform(value: any, format: string): string {
        return this.intl.format(format || '{0}', value);
    }
}
