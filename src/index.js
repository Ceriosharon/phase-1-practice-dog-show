document.addEventListener('DOMContentLoaded', () => {

})
document.addEventListener("DOMContentLoaded", () => {
    const dogForm = document.getElementById("dog-form");
    const dogTableBody = document.querySelector("#dog-table tbody");

    // Fetch and render dogs on page load
    function fetchDogs() {
        fetch("http://localhost:3000/dogs")
            .then(response => response.json())
            .then(dogs => renderDogs(dogs));
    }

    // Render dog entries in the table
    function renderDogs(dogs) {
        dogTableBody.innerHTML = "";
        dogs.forEach(dog => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${dog.name}</td>
                <td>${dog.breed}</td>
                <td>${dog.sex}</td>
                <td><button data-id="${dog.id}" class="edit-button">Edit</button></td>
            `;
            dogTableBody.appendChild(row);
        });
    }

    // Handle form submission to update dog
    dogForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const dogId = dogForm.dataset.id; // Retrieve dog ID for updating
        const updatedDog = {
            name: dogForm.name.value,
            breed: dogForm.breed.value,
            sex: dogForm.sex.value
        };

        fetch(`http://localhost:3000/dogs/${dogId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedDog)
        })
        .then(() => {
            fetchDogs(); // Refresh dog list
            dogForm.reset(); // Reset form
            delete dogForm.dataset.id; // Clear the ID from the form
        });
    });

    // Edit button functionality
    dogTableBody.addEventListener("click", (event) => {
        if (event.target.classList.contains("edit-button")) {
            const dogId = event.target.dataset.id;
            fetch(`http://localhost:3000/dogs/${dogId}`)
                .then(response => response.json())
                .then(dog => {
                    dogForm.name.value = dog.name;
                    dogForm.breed.value = dog.breed;
                    dogForm.sex.value = dog.sex;
                    dogForm.dataset.id = dog.id; // Set the ID for updating
                });
        }
    });

    // Initial fetch of dogs
    fetchDogs();
});
