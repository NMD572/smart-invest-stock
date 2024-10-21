document.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        const content = reader.result;
        console.log(content);
        alert('Read file successfully!');
    };

    reader.onerror = function () {
        console.error('We can not read your file, please check the file and try again!');
    };

    reader.readAsText(file, 'utf-8');
});