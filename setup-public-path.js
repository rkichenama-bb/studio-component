const scriptSrc = document.currentScript.src.replace(location.origin, '');
const pathParts = scriptSrc.split('/').filter((x) => !!x);
pathParts[pathParts.length - 1] = '';
__webpack_public_path__ = `/${pathParts.join('/')}`;
