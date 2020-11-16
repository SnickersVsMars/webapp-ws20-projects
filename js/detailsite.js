var id = new URLSearchParams(window.location.search).get("id");
$.ajax({
    url:"data/project_sample_data.json",
    dataType:"json",
    type:"get",
    cache: false,
    success: function (data) {
        $(data.projects).each(function(index, value) {
            var project;
            if (value.id === id) {
                project=value;

                document.getElementById("label").innerHTML=`${project.label}`;
                document.getElementById("number").innerHTML=`${project.number}`;
                document.getElementById("description").innerHTML=`${project.description}`;
                document.getElementById("manager").innerHTML=`${project.manager}`;
                document.getElementById("customer").innerHTML=`${project.customer}`;
                document.getElementById("costCenter").innerHTML=`${project.costCenter}`;
                document.getElementById("breadcrumb").innerHTML=`${project.number}`;

                employeesList(project.employees);
                milestonesTable(project.milestones);
            }

        })
    }
});
//project sample data mit id ansprechen

function employeesList (employees) {
    if (employees.length > 0) {
        document.getElementById("employees").appendChild(makeUL(employees));
    }
}

function makeUL(array) {
    // Create the list element:
    var list = document.createElement('ul');

    for (var i = 0; i < array.length; i++) {
        // Create the list item:
        var item = document.createElement('li');

        // Set its contents:
        item.appendChild(document.createTextNode(array[i]));

        // Add it to the list:
        list.appendChild(item);
    }
    // Finally, return the constructed list:
    return list;
}
function milestonesTable (milestones) {
    if (milestones.length > 0) {
        document.getElementById("milestones").appendChild(makeTable(milestones));
    }
}

function makeTable (array) {
        // EXTRACT VALUE FOR HTML HEADER.
        // ('Book ID', 'Book Name', 'Category' and 'Price')
        var col = [];
        for (var i = 0; i < array.length; i++) {
            for (var key in array[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
        table.className = "table table-hover table-striped";

        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        let thead = table.createTHead();
        thead.className = 'thead-dark';

        let tr = thead.insertRow(-1);                   // TABLE ROW.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.className='thead-dark';

            if(col[i] === 'date')
                th.innerHTML = 'Datum';
            else if(col[i] === 'label')
                th.innerHTML = 'Bezeichnung';
            else if(col[i] === 'description')
                th.innerHTML = 'Beschreibung';
            tr.appendChild(th);
        }

        var tbody = table.createTBody();

    // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < array.length; i++) {

            tr = tbody.insertRow(-1);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);

                if(j===0)
                    tabCell.innerHTML = new Date(array[i][col[j]]).toLocaleDateString();
                else
                    tabCell.innerHTML = array[i][col[j]];
            }
        }
        return table;
}