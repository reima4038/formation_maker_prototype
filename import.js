function importData(successCallBack, failuarCallBack) {
    fileDialog().then(successCallBack, failuarCallBack)
}

async function fileDialog() {
    const file = await showOpenFileDialog();
    const content = await readAsText(file);
    // 内容表示
    return content
}

const showOpenFileDialog = () => {
    return new Promise((resolve, reject) => {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json, application/json';
            input.onchange = event => { 
                resolve(event.target.files[0]);
            };
            input.click();
        } catch(err) {
            reject('reject show open file dialog')
        }
 
    });
};

const readAsText = file => {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => { resolve(reader.result); };
    });
};


