///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { progress } from '@progress/jsdo';

@Injectable()
export class ProgressSessionService {
    public createdSessions: { [key: string]: progress.data.JSDOSession } = {};

    public tryCreateSession(dataProvider, providerName): Observable<progress.data.JSDOSession> {
        return Observable.create(observer => {
            if (!this.createdSessions[providerName]) {
                const session = new progress.data.JSDOSession({
                    serviceURI : dataProvider.serviceUri,
                    authenticationModel : dataProvider.authenticationModel
                });

                // Get these from the user input
                const username = '';
                const password = '';

                session.login(username, password)
                .done((sessionInstane) => {
                    sessionInstane.addCatalog(dataProvider.catalogUris[0])
                    .done((jsdoSession) => {
                        this.createdSessions[providerName] = jsdoSession;
                        observer.next();
                    })
                    .fail((s, result, info) => {
                        observer.error(this.getError(result, info));
                    });
                })
                .fail((s, result, info) => {
                    observer.error(this.getError(result, info));
                });
            } else {
                return observer.next();
            }
        });
    }

    private getError(result, info): HttpErrorResponse {
        return new HttpErrorResponse({ error: { result, info }, status: info[0].xhr.status, statusText: info[0].xhr.statusText });
    }
}
