$(document).ready(function () {
    var iChange = 0;
    var iRemove = 0;
    var todoIdGenerate = 0;            // Initial todo id
    var todoList = [];
    var dataJson = 0;                 // Initial todo list
    
    /**
     * @author Chuong.Hoang
     * @description add new todo task function
     * @param title title of new todo task
     * @param {*} id id of new todo task
     */
    function addTodo(title, id) {
        if (title && id) {
            var elementHtml = "<tr><td><input class='btnRemove' id='btnRemove" + id + "'  type='button' value='Remove'/><input class='btnEdit' id='btnEdit" + id + "'  type='button' value='Edit'/><span> "+ title +"</span></td></tr>";
            // $("table").append(elementHtml);
            $("#todoTask").append(elementHtml);
            // Không nên dùng table vì trong view có thể có nhiều table. Chuyển sang dùng Id cụ thể.
        }
    }

    function editTodo(title, id) {

        if (title && id) {
            // var elementHtml = "<tr><td><input class='btnRemove' id='btnRemove" + id + "'  type='button' value='Remove'/><input class='btnEdit' id='btnEdit" + id + "'  type='button' value='Edit'/><span> "+ title +"</span></td></tr>";
            $(".btnEdit").next().keydown(function() {
                $("#btnEdit"+id).next().val(title);
            });
        }
    }

    //Ajax get data
    function getData(handleData) {
        $.ajax({    
            url: 'https://pgjstraining.herokuapp.com/api/todos/',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                handleData(data);
                for (var i = 0; i < Object.keys(data).length; i++) {
                    text = data[Object.keys(data)[i]].text;
    
                    todoIdGenerate += 1;
    
                    todoList.push({
                        id: todoIdGenerate,
                        title: text
                    });
    
                    addTodo(text, todoIdGenerate);
                }
            },
            error: function () {  
                console.log('Error!');  
            }
        });
    }

    getData(function(output) {
        // console.log(Object.keys(output)[0]);
        dataJson = output;
    });

    // event when click to add todo
    $("#btnAdd").click(function () {

        // var input = document.getElementById("txtAdd");
        // var input = input.value;
        // có thể dùng luôn cái này cho ngắn gọn.
        var title = $("#txtAdd").val();

        if (title !== "") {
            todoIdGenerate += 1;

            var newTodo = {
                id: todoIdGenerate,
                title: title
            };

            todoList.push(newTodo);
            addTodo(newTodo.title, newTodo.id);

            // Reset input value
            $("#txtAdd").val("");

            //Ajax add
            $.ajax({
                url: 'https://pgjstraining.herokuapp.com/api/todos/',
                method: 'POST',
                dataType: 'json',
                data: {
                    text: title
                },
                error: function() {
                    console.log("Error!");
                }
            });
        }
        else {
            alert("Please enter the value!");
            $("#txtAdd").css("border", "1px solid red");
        }
    });

    $("#addTodoForm").on("submit", function (e) {
        e.preventDefault();
    });
 
    // event when click to remove todo
    $("#todoTask").on("click", ".btnRemove", function () {
        var idAttribute = $(this).attr("id"); //get property id
        if (idAttribute) {
            // get todo removing id through id attribute
            var todoRemoveId = idAttribute.split("btnRemove")[1];
            iRemove = todoRemoveId-1;
            // remove todo task inside todoList
            for (var i = 0; i < todoList.length; i++) {
                if (todoList[i].id === parseInt(todoRemoveId)) {
                    todoList.splice(i, 1);
                    break;
                }
                $.ajax({    
                        url: 'https://pgjstraining.herokuapp.com/api/todos/'+Object.keys(dataJson)[iRemove],
                        method: 'DELETE',
                        dataType: 'json',
                        success: function(data) {
                            console.log(data);
                        },
                        error: function () {  
                            console.log('Error!');  
                        }
                    });
            }
            
           // remove todo task on html dom
           // .closest() là gì thì tự nghiên cứu nhé.
           $(this).closest('tr').remove();
        }
    });

    // event when click to edit todo
    $("#todoTask").on("click", ".btnEdit",function() {
        var idAttribute = $(this).attr("id");
        if (idAttribute) {
            var todoEditId = idAttribute.split("btnEdit")[1];      
            iChange = idAttribute.split("btnEdit")[1]-1;
            for (var i = 0; i < todoList.length; i++) {
                if (todoList[i].id === parseInt(todoEditId)) {
                    $(this).next().attr('contenteditable','true');
                    $(this).next().focus();
                    editTodo(todoList[i].title, todoList[i].id);
                    break;
                }
            }
        } 
    });

    //event when on blur to title 
    $("#todoTask").on("blur", "span",function(){
        todoList[iChange].title = $(this).text();
        $.ajax({
            url: 'https://pgjstraining.herokuapp.com/api/todos/'+Object.keys(dataJson)[iChange],
            method: 'POST',
            dataType: 'json',
            data: {
                text: todoList[iChange].title  
            },
            error: function() {
                console.log("Error!");
            }
        });
    });

    // $("#todoTask").on("blur", "span",function(){
    //     alert(todoList[iChange].title);
    // });
    
    
    
    // $("#btnOk").click(function() {
    //     var valInput = $("#txtEdit").val();

    //     for (var i = 0; i < todoList.length; i++) {

    //     }
    // });
    

});
