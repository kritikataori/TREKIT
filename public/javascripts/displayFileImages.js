// function previewMultiple(event) {
//     const form = document.querySelector('#formFile');
//     form.innerHTML = ""; //clear existing previews
//     var images = document.getElementById("image");
//     var number = images.files.length;
//     for (i = 0; i < number; i++) {
//         var urls = URL.createObjectURL(event.target.files[i]);
//         document.getElementById("formFile").innerHTML += '<img src="' + urls + '">';
//     }
// }

function previewMultiple(event) {
    const form = document.querySelector('#formFile');
    form.innerHTML = ""; // Clear existing previews

    const images = event.target.files; // Get the files directly from the event
    const number = images.length; // Get the number of selected files

    for (let i = 0; i < number; i++) {
        const urls = URL.createObjectURL(images[i]);

        // Create an image element
        const img = document.createElement('img');
        img.src = urls;
        img.classList.add('card-img'); // Apply your existing image class

        // Create a container for the image
        const container = document.createElement('div');
        container.classList.add('image-container');

        // Create a remove button
        const removeButton = document.createElement('button');
        removeButton.innerText = "Remove";
        removeButton.classList.add('btn', 'btn-danger', 'mt-2'); // Bootstrap styling for button

        // Remove image from preview on click
        removeButton.addEventListener('click', () => {
            container.remove(); // Remove the image container
        });

        // Append elements to the image container
        container.appendChild(img); // Add image
        container.appendChild(removeButton); // Add remove button

        // Append the container to the form
        form.appendChild(container);
    }
}
