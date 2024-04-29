import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import BadgeDirective from 'primevue/badgedirective';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmPopup from 'primevue/confirmpopup';
import ConfirmationService from 'primevue/confirmationservice';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import DialogService from 'primevue/dialogservice';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import Menu from 'primevue/menu';
import Message from 'primevue/message';
import Paginator from 'primevue/paginator';
import Password from 'primevue/password';
import Ripple from 'primevue/ripple';
import SelectButton from 'primevue/selectbutton';
import Sidebar from 'primevue/sidebar';
import SplitButton from 'primevue/splitbutton';
import StyleClass from 'primevue/styleclass';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';

import BlockViewer from '@/components/BlockViewer.vue';

import '@/assets/styles.scss';

const app = createApp(App);

app.use(createPinia())
app.use(router);
app.use(PrimeVue, { ripple: true });
app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);

app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);

app.component('BlockViewer', BlockViewer);

app.component('Accordion', Accordion);
app.component('AccordionTab', AccordionTab);
app.component('Button', Button);
app.component('Card', Card);
app.component('Checkbox', Checkbox);
app.component('Column', Column);
app.component('ConfirmDialog', ConfirmDialog);
app.component('DataTable', DataTable);
app.component('Dialog', Dialog);
app.component('Divider', Divider);
app.component('Dropdown', Dropdown);
app.component('IconField', IconField);
app.component('InputIcon', InputIcon);
app.component('InputMask', InputMask);
app.component('InputSwitch', InputSwitch);
app.component('InputText', InputText);
app.component('Menu', Menu);
app.component('Message', Message);
app.component('Paginator', Paginator);
app.component('Password', Password);
app.component('SelectButton', SelectButton);
app.component('Sidebar', Sidebar);
app.component('SplitButton', SplitButton);
app.component('Toast', Toast);

app.mount('#app');
