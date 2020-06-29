import { addDecorator } from '@storybook/vue'

const decoratorVueTemplate = () => ({ template: `<div style="margin: 25px; max-width: 1400px;"><story/></div>` })
addDecorator(decoratorVueTemplate)
