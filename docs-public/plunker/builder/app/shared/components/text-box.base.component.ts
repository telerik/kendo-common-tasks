///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Input, EventEmitter, Output, OnInit } from '@angular/core';
import { KbInputBaseComponent } from './input.base.component';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';


export class KbTextBoxBaseComponent extends KbInputBaseComponent implements OnInit {
    @Output() public modelChange: EventEmitter<string> = new EventEmitter();

    private modelChanged$: Subject<string> = new Subject<string>();

    ngOnInit() {
        super.ngOnInit();

        this.modelChanged$.pipe(
            debounceTime(this.config.debounce), // wait debounce time in ms after the last event before emitting last event
            distinctUntilChanged<string>() // only emit if value is different from previous value
        )
        .subscribe(model => {
            super.setModel<string>(model);
            super.setErrorMessage();
        });
    }

    set model(value: string) {
        super.setModel<string>(value);
    }

    @Input() get model(): string {
        return super.getModel<string>();
    }

    public valueChange(value: string): void {
        this.modelChanged$.next(value);
    }
}
