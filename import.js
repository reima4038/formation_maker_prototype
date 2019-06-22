function fileDialog() {
    const showOpenFileDialog = () => {
        return new Promise(resolve => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json, application\/json';
            input.onchange = event => { resolve(event.target.files[0]); };
            input.click();
        });
    };
    
    const readAsText = file => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => { resolve(reader.result); };
        });
    };
    
    return (async () => {
        const file = await showOpenFileDialog();
        const content = await readAsText(file);
        // 内容表示
        return content
    })();
}

function importDancersData(successCallBack, failuarCallBack) {
    fileDialog().then(successCallBack, failuarCallBack)
}
