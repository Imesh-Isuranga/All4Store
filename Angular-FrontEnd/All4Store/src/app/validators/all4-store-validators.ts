import { FormControl, ValidationErrors } from "@angular/forms";

export class All4StoreValidators {
    //whiteSpaces validation
    static notOnlyWhitespace(control:FormControl):ValidationErrors{
        //check if string only contain whitespace
        if((control.value != null) && (control.value.trim().length === 0)){
            //invalid, return error object
            return {'notOnlyWhitespace': true};
        }else{
            //valid,return null
            return {};
        }
    }
}
