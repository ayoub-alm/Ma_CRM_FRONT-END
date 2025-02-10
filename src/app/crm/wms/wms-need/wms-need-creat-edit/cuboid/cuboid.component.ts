import {Component, ElementRef, Input, Renderer2} from '@angular/core';

@Component({
  selector: 'app-cuboid',
  standalone: true,
  imports: [],
  templateUrl: './cuboid.component.html',
  styleUrl: './cuboid.component.css'
})
export class CuboidComponent {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @Input() set length(value: string) {
    this.setCSSVariable('--cuboid-length', value);
  }

  @Input() set width(value: string) {
    this.setCSSVariable('--cuboid-width', value);
  }

  @Input() set height(value: string) {
    this.setCSSVariable('--cuboid-height', value);
  }

  public setCSSVariable(name: string, value: string): void {
    this.renderer.setStyle(this.el.nativeElement, name, value);
  }
}
