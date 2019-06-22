function importData(successCallBack, failuarCallBack) {
    console.log('1. import data')
    fileDialog().then(successCallBack, failuarCallBack)
}

async function fileDialog() {
    console.log('2. file dialog')
    const file = await showOpenFileDialog();
    console.log('3. show open file dialog')
    const content = await readAsText(file);
    console.log('4. read as text')
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


