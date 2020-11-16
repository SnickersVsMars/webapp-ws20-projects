var overview = document.getElementById("card-container");
var template = document.getElementById("card-template");


$.ajax({
    url:"data/project_sample_data.json",
    dataType:"json",
    type:"get",
    cache: false,
    success: function (items){
        $(items.projects).each(function(i, project){
            var card = template.content.cloneNode(true);
            card.querySelector(".project-number").innerHTML = project.number;
            card.querySelector(".project-manager").innerHTML = project.manager;
            card.querySelector(".project-employees").innerHTML = project.employees.length;
            card.querySelector(".project-label").innerHTML = project.label;
            card.querySelector(".project-milestone").innerHTML = lastMilestone(project.milestones);
            card.querySelector(".project-customer").innerHTML = project.customer;
            overview.appendChild(card);
            var cards = document.getElementsByClassName('card');
            cards[cards.length-1].addEventListener("click",()=>showDetail(project.id));
        })
    }
});

function showDetail(id){
    location.href = "detailsite.html?id=" + id;
};

function lastMilestone(milestones){
    var lastMilestone = null;
    var today = new Date();
    for (var i= 0; i < milestones.length; i++) {
        var milestoneDate = new Date(milestones[i].date)
        if(today <= milestoneDate && (lastMilestone === null || milestoneDate < lastMilestone))
            lastMilestone = milestoneDate;
    }
    return lastMilestone.toLocaleDateString();
}