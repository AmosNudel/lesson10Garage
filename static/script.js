// script.js


const read = () => {
    axios.get('/read')
        .then(response => {
            const updatedData = response.data; // Get updated data from the server
            console.log(updatedData);

            const tbody = document.querySelector('#dataTable tbody');
            tbody.innerHTML = ''; // Clear the current table rows

            // Get the column order from the headers
            const columnOrder = Array.from(document.querySelectorAll('#dataTable thead th'))
                .map(th => th.dataset.key)
                .filter(key => key !== undefined); // Filter out undefined keys for the "Actions" header

            // Repopulate the table with the updated data
            updatedData.forEach(row => {
                const rowHtml = `
                    <tr data-vehicle-id="${row.VehicleID}">
                        ${columnOrder.map(key => `<td>${row[key] || ''}</td>`).join('')}
                        <td>
                            <button class="updateBtn" onclick="updateRow(${row.VehicleID})">Update</button>
                            <button onclick="deleteRow(${row.VehicleID})">Delete</button>
                        </td>
                    </tr>
                `;
                tbody.insertAdjacentHTML('beforeend', rowHtml); // Append the row to the table body
            });
        })
        .catch(error => {
            console.error('Error reading data:', error);
        });
};





const add = () => {
    const inputs = document.querySelectorAll('#addInput input');
    const inputValues = {};

    // Collect values from input fields
    inputs.forEach(input => {
        const id = input.id.replace('input', ''); // Strip 'input' prefix
        inputValues[id] = input.value;
    });

    console.log(inputValues);

    // Send the new data to the server via POST request
    axios.post('/add', inputValues)
        .then(response => {
            console.log(response.data);
            read(); // Refresh the table after adding data

            // Clear the input fields after adding the data
            inputs.forEach(input => {
                input.value = ''; // Reset input value to an empty string
            });
        })
        .catch(error => {
            console.error('Error adding data:', error);
        });
};

const deleteRow = (id) => {
    axios.delete(`/delete/${id}`)
        .then(response => {
            console.log(response.data);
            read(); // Refresh the table after deleting data
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete the entry. Please try again.');
        });
};

const updateRow = (id) => {
    const inputs = document.querySelectorAll('#addInput input');
    const inputValues = {};

    // Collect values from input fields, only if they are not empty
    inputs.forEach(input => {
        const field = input.id.replace('input', ''); // Strip 'input' prefix
        if (input.value.trim() !== '') {
            inputValues[field] = input.value.trim();
        }
    });

    console.log(inputValues);

    // Send the updated data to the server via PUT request
    axios.put(`/update/${id}`, inputValues)
        .then(response => {
            console.log(response.data);
            read(); // Refresh the table after updating data

            // Clear the input fields after updating the data
            inputs.forEach(input => {
                input.value = ''; // Reset input value to an empty string
            });
        })
        .catch(error => {
            console.error('Error updating data:', error);
        });
};

// Call the read function to populate the table when the page loads
read();
