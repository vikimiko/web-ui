import {Component, Input} from '@angular/core';

@Component({
  selector: 'left-panel',
  template: require('./left-panel.component.html'),
  styles: [ require('./left-panel.component.scss').toString() ]
})
export class LeftPanelComponent {
  @Input() public collapsedValue: boolean;
}
