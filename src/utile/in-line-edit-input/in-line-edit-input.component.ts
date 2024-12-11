import {Component, Input, OnInit, Output} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import EventEmitter from 'node:events';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-in-line-edit-input',
  standalone: true,
  imports: [
    MatIconButton,
    MatIcon
  ],
  templateUrl: './in-line-edit-input.component.html',
  styleUrl: './in-line-edit-input.component.css'
})
export class InLineEditInputComponent implements OnInit {
  inLineInput: FormGroup;
  @Input() initValue: string = '';

  constructor(private fb: FormBuilder, private router: Router,) {
    this.inLineInput = fb.group({
      name:[this.initValue, Validators.required]
    })
  }

  ngOnInit() {

    // this.fb.
  }

  isEditing = false;

  toggleEditMode() {
    this.isEditing = !this.isEditing;
  }

  copyText() {
    navigator.clipboard.writeText(this.initValue).then(() => {
      console.log('Copied to clipboard');
    });
  }
}
