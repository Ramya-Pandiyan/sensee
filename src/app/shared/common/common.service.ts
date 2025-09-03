import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Common {
  private underwritingClickedSource = new Subject<void>();
  underwritingClicked$ = this.underwritingClickedSource.asObservable();

  emitUnderwritingClicked() {
    this.underwritingClickedSource.next();
  }

}
