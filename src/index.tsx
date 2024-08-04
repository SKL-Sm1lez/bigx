import { createRoot } from 'react-dom/client';
import { BigxProviders } from '@cdk/provider/bigx-providers';

let container = document.getElementById('root');

if (!container) {
	container = document.createElement('div');
	container.setAttribute('id', 'root');
	document.body.appendChild(container);
}

const root = createRoot(container);
root.render(<BigxProviders isDevMode={true}>Привет!</BigxProviders>);
