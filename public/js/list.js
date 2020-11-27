var overview = document.getElementById("card-container");
var template = document.getElementById("card-template");

data = get(datafilepath).done((data) => {
    populateData(data);
});

function populateData(data) {
    $(data.projects).each(function (i, project) {
        var card = template.content.cloneNode(true);
        card.querySelector(".project-number").innerHTML = validate(
            project.number
        );
        card.querySelector(".project-manager").innerHTML = validate(
            project.manager
        );

        card.querySelector(".project-label").innerHTML = validate(
            project.label
        );
        card.querySelector(".project-milestone").innerHTML = validate(
            lastMilestone(project.milestones)
        );
        card.querySelector(".project-customer").innerHTML = validate(
            project.customer
        );

        if (
            project.employees != null &&
            project.employees != undefined &&
            project.employees.length > 0
        )
            card.querySelector(".project-employees").innerHTML =
                project.employees.length;

        overview.appendChild(card);
        var cards = document.getElementsByClassName("card");
        cards[cards.length - 1].addEventListener("click", () =>
            showDetail(project.id)
        );
    });
    document.getElementById("busy-indicator").hidden = true;
}

function showDetail(id) {
    location.href = "projects/" + id;
}

function lastMilestone(milestones) {
    if (
        milestones === null ||
        milestones === undefined ||
        milestones.length < 1
    )
        return;

    var lastMilestone = null;
    var today = new Date();
    for (var i = 0; i < milestones.length; i++) {
        if (milestones[i].date === null || milestones[i].date === undefined)
            continue;

        var milestoneDate = new Date(milestones[i].date);
        if (
            today <= milestoneDate &&
            (lastMilestone === null || milestoneDate < lastMilestone)
        )
            lastMilestone = milestoneDate;
    }

    return formatDate(lastMilestone);
}
