import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormRecord } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Vehicle } from '../models/clientes.model';

@Injectable({
  providedIn: 'root'
})
export class ClientFormService {

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService
  ) { }

  createClientForm(): FormGroup {
    const vehicleForm = this.createVehicleForm();
    this.setupPlatesValidation(vehicleForm);
    return this.fb.group({
      name: ['', Validators.required],
      last_name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(60)]],
      cellphone_number: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      mechanicals_id: [this.authService.mechanicalWorkshop()?.id, [Validators.required]],
      vehicle: this.fb.array([vehicleForm])
    });
  }

  private createVehicleForm(): FormGroup {
    return this.fb.group({
      make_id: ['', Validators.required],
      model_id: ['', Validators.required],
      plates: ['', [Validators.required, Validators.maxLength(15)]],
    });
  }

  updateClientForm(): FormGroup {
    const vehicleForm = this.updateVehicleForm();
    this.setupPlatesValidation(vehicleForm);

    return this.fb.group({
      peoples_id: ['', Validators.required],
      clients_id: ['', Validators.required],
      name: ['', Validators.required],
      last_name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(60)]],
      cellphone_number: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      mechanicals_id: [this.authService.mechanicalWorkshop()?.id, [Validators.required]],
      vehicle: this.fb.array([vehicleForm])
    });
  }

  private updateVehicleForm(): FormGroup {
    return this.fb.group({
      vehicles_id: ['', Validators.required],
      make_id: ['', Validators.required],
      model_id: ['', Validators.required],
      plates: ['', [Validators.required, Validators.maxLength(15)]],
    });
  }

  setClientFormValues(form: FormGroup, clientData: any): void {
    form.patchValue({
      name: clientData.name,
      last_name: clientData.last_name,
      cellphone_number: clientData.cellphone_number,
      email: clientData.email,
      vehicle: this.fb.array([
        (() => {
          const vehicleForm = this.createVehicleForm();
          this.setVehicleFormValues(vehicleForm, clientData.vehicle[0]);
          return vehicleForm;
        })()
      ])
    });
  }

  setVehicleFormValues(vehicleForm: FormGroup, vehicleData: any): FormRecord {
    vehicleForm.patchValue({
      make_id: vehicleData.make_id,
      model_id: vehicleData.model_id,
      plates: vehicleData.plates
    });
    return vehicleForm.value;
  }

  private setupPlatesValidation(vehicleForm: FormGroup): void {
    vehicleForm.get('plates')?.valueChanges.subscribe(value => {
      if (value && typeof value === 'string') {
        const filteredValue = value.replace(/[^A-Za-z0-9-]/g, '');
        const upperValue = filteredValue.toUpperCase();

        if (value !== upperValue) {
          vehicleForm.get('plates')?.setValue(upperValue, { emitEvent: false });
        }
      }
    });
  }

  resetForm(form: FormGroup): void {
    form.reset();
    form.patchValue({
      mechanicals_id: this.authService.mechanicalWorkshop()?.id,
    });

    const vehicleArray = form.get('vehicle') as FormArray;
    const firstVehicle = vehicleArray.at(0) as FormGroup;

    firstVehicle.patchValue({
      make_id: '',
      model_id: '',
      plates: ''
    });
  }
}
