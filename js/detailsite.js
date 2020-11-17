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

                fillEmployess(project.employees);
                fillMilestones(project.milestones);
            }

            document.getElementById("busy-indicator").hidden=true;
        })
    }
});

function fillEmployess(employees) {
    if (employees == null || employees == 'undefined' || employees.length < 1)
        return;

    let ul = document.getElementById("employees");

    for (let i = 0; i < employees.length; i++) {
        // Create the list item:
        let item = document.createElement('li');

        // Set its contents:
        item.innerText = employees[i];

        // Add it to the list:
        ul.appendChild(item);
    }
}

function fillMilestones(milestones) {
    if (milestones == null || milestones == 'undefined' || milestones.length < 1)
        return;

    let tbody = document.getElementById("table-milestone-body");
    tbody.innerHTML = '';

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (let i = 0; i < milestones.length; i++) {

        let tr = tbody.insertRow();

        tr.insertCell().innerHTML = new Date(milestones[i].date).toLocaleDateString();
        tr.insertCell().innerHTML = milestones[i].label;
        tr.insertCell().innerHTML = milestones[i].description;
    }
}