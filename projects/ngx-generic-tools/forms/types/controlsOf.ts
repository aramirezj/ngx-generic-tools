import { FormControl } from "@angular/forms";

export type ControlsOf<T extends Record<string, any>> = {
    [K in keyof T]: FormControl<T[K]>;
  };