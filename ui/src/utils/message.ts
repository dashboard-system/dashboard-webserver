import { enqueueSnackbar, OptionsObject } from 'notistack'

// Base message function
const message = (textMessage: string, option?: OptionsObject) => {
  enqueueSnackbar(textMessage, option) // You were missing the function call
}

// Success message with default success styling
const successMessage = (messageText: string, option?: OptionsObject) => {
  const defaultSuccessOptions: OptionsObject = {
    variant: 'success',
    autoHideDuration: 3000,
    ...option // Spread any custom options to override defaults
  }
  message(messageText, defaultSuccessOptions)
}

// Error message
const errorMessage = (messageText: string, option?: OptionsObject) => {
  const defaultErrorOptions: OptionsObject = {
    variant: 'error',
    autoHideDuration: 5000,
    ...option
  }
  message(messageText, defaultErrorOptions)
}

// Warning message
const warningMessage = (messageText: string, option?: OptionsObject) => {
  const defaultWarningOptions: OptionsObject = {
    variant: 'warning',
    autoHideDuration: 4000,
    ...option
  }
  message(messageText, defaultWarningOptions)
}

export { message, successMessage, errorMessage, warningMessage }