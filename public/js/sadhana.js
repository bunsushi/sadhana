$(document).ready(function () {

    console.log("I'm connected");

    // Moment.js Dates
    var today = moment().format('dddd, MMMM Do YYYY');
    var month = moment().format('MMMM');
    var monthAndYear = moment().format('MMMM YYYY');

    $("#today").append(today);
    $("#this-month").append(month);
    $("#this-month-and-year").append(monthAndYear);

    // Select all links with hashes
    $('a[href*="#"]')
        // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function (event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
                &&
                location.hostname == this.hostname
            ) {
                // Figure out element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top - 100
                    }, 600, function () {
                        // Callback after animation
                        // Must change focus!
                        var $target = $(target);
                        $target.focus();
                        if ($target.is(":focus")) { // Checking if the target was focused
                            return false;
                        } else {
                            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                            $target.focus(); // Set focus again
                        };
                    });
                }
            }
        });

    // Button jQuery for user info save into sessionStorage
    $("#sign-up, #log-in").on("click", function(event) {
        // Capture user input
        var saveUser = {
            email: $("#email").val().trim()
        };
        // Clear sessionStorage and save user email
        sessionStorage.clear();
        sessionStorage.setItem("email", saveUser.email);
    });
    
    

    var habits = ["coding", "running", "reading", "machine-learning"];
    var daysInMay = 31;

    // Generate a sadha-square
    function makeSadha() {
        for (var i = 0; i < habits.length; i++) {
            var goal = $("<div>");
            goal.attr("id", habits[i]);
            goal.addClass("habit");
            goal.append("<p>" + habits[i]);
            $("#sadha-squares").append(goal);
            for (var j = 0; j < daysInMay; j++) {
                var sadhaSquare = $("<div>");
                sadhaSquare.addClass("square");
                $("#" + habits[i]).append(sadhaSquare);
            }
        }
    };

    makeSadha();

    // TASKS

    var taskContainer = $(".task-container");
    var tasks;

    var taskInput = $("#task-input");

    function getTasks() {
        $.get("/api/tasks/todo/" + sessionStorage.getItem("id"), function(data) {
            console.log("Tasks", data);
            tasks = data;
            initializeRows();
        })
    }

    function initializeRows() {
        taskContainer.empty();
        var tasksToAdd = [];
        for (var i = 0; i < tasks.length; i++) {
            tasksToAdd.push(createNewRow(tasks[i]));
        }
        taskContainer.append(tasksToAdd)
    }

    function createNewRow(task) {
        var newTaskCard = $("<div>");
        var deleteBtn = $("<button>");
        deleteBtn.text("x");
        deleteBtn.addClass("delete btn btn-danger");
        var deferBtn = $("<button>");
        deferBtn.text(">");
        deferBtn.addClass("btn btn-primary");
        var newTaskName = $("<h5>");
        newTaskName.text(task.task);
        newTaskCard.append(deleteBtn);
        newTaskCard.append(deferBtn);
        newTaskCard.append(newTaskName);
        return newTaskCard;
    }

    $(document).on("submit", "#add-task", newTask)

    function newTask(event) {
        event.preventDefault();
        if (!taskInput.val().trim()) {
            return;
        }

        prependTask({
            task: taskInput
                .val()
                .trim(),
            UserId: sessionStorage.getItem("id")
        });

        taskInput.val('');
    };

    function prependTask(taskData) {
        $.post("/api/tasks/todo", taskData)
            .then(getTasks);
    }
    getTasks();

});
