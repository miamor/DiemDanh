import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { KeysPipe } from "./keys-pipe";
import { RelativeTime } from "./relative-time";

@NgModule({
    imports: [CommonModule],
    declarations: [
        KeysPipe,
        RelativeTime
    ],
    exports: [
        KeysPipe,
        RelativeTime
    ]
})

export class PipeModule {
    static forRoot() {
        return {
            ngModule: PipeModule,
            providers: [],
        };
    }
}