import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RsvpService } from '../../services/rsvp.service';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
})
export class RsvpComponent {
  
  rsvpForm: FormGroup;
  submitted = false;
  success = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private rsvpService: RsvpService) {
    this.rsvpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      ceremony: ['', Validators.required],
      brunch: ['', Validators.required],
    });
  }

  async onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.rsvpForm.invalid) return;

    const error = await this.rsvpService.submitRSVP(this.rsvpForm.value);
    if (error) {
      this.errorMessage = error.message;
    } else {
      this.success = true;
      this.rsvpForm.reset();
      this.submitted = false;
    }
  }
}