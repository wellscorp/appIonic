angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
})

.controller('TesteCtrl', function($scope, Lista) {
    $scope.chats = Lista.all();
        console.log($scope);
})

.controller('TesteDetailCtrl', function($scope, $stateParams, Lista) {
    $scope.chat = Lista.get($stateParams.testeId);
    console.log($scope);
})

.controller('NotaDetailCtrl', function($scope, $stateParams, Notas) {
    $scope.nota = Notas.get($stateParams.notaId);
    console.log($scope.nota);

        $scope.editar = function(id){

            var titulo= document.getElementById("titulo").value;
            var descricao= document.getElementById("descricao").value;

            var  database= window.openDatabase("banco", "1.0", "banco de dados", 200000);
            database.transaction(function(tx){
                editarNota(tx, titulo, descricao, id);
            }, errorNota, successNota);
        };

        $scope.doRefresh = function() {
            $http.get('/tab/nota')

                .success(function(newItems) {
                    $scope.nota = newItems;
                    $window.location.reload(true);
                })
                .finally(function() {
                    // Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };

        function editarNota(tx, titulo, descricao, id){

            var now= new Date();
            var data= now.getFullYear()+now.getMonth()+now.getDay();
            var hora= now.getHours()+now.getMinutes()+now.getSeconds();

            query= "UPDATE nota SET titulo = '"+titulo+"' , descricao = '"+descricao+"' WHERE titulo =  '"+id+"'; ";
            //alert(query);
            tx.executeSql(query);
            var nota= [{
                id: 0,
                titulo: titulo,
                descricao: descricao
            }];
            Notas.change($scope.nota, nota);
        }

        function errorNota(error){
            alert("Erro ao inserir no banco: " + error);
        }

        function successNota(){
            window.open("index.html#/tab/nota", "_self");
            //window.history.back();
            //window.location.replace("index.html#/tab/nota");
            //window.location.reload();
            //window.open("index.html#/tab/nota", "_self");
            //alert("Chamado inserido com sucesso!");
            //window.open("nota.html");
        }

    })



.controller('NotaCtrl', function($scope, Notas) {

    $scope.notas = Notas.all();
    //console.log($scope);
    $scope.data = {
        showDelete: false
    };

    $scope.delete = function(item) {
        //alert('Edit Item: ' + item.id);
        Notas.remove(item);
        //$scope.items.splice($scope.items.indexOf(item), 1);
    };
    $scope.share = function(item) {
        alert('Share Item: ' + item.id);
        console.log(items);
    };

    $scope.moveItem = function(item, fromIndex, toIndex) {
        $scope.items.splice(fromIndex, 1);
        $scope.items.splice(toIndex, 0, item);
    };

    $scope.onItemDelete = function(item) {
        $scope.items.splice($scope.items.indexOf(item), 1);
    };

    $scope.addNota = function(){
        //console.log(document.write(document.location.host));
        //console.log(document.write(document.location.pathname));
        //window.open(document.location.pathname+"/tab/nota/inserir","_self");
    };

        // ----------- SELECT BANCO -------------------
        function getNota(){
            database= window.openDatabase("banco", "1.0", "banco de dados", 200000);
            database.transaction(SelectNota, resultError, resultSuccess);
        }

        function SelectNota(tx){
            tx.executeSql("SELECT * FROM nota", [], resultSuccess,resultError);
        }
        function resultSuccess(tx, responde){
            //alert("Resposta : " +responde.rows.item(3).titulo);
            var notas= [];
            for(var i=0; i< responde.rows.length; i++ ) {
                notas.push({
                    id: responde.rows.item(i).rowid,
                    titulo: responde.rows.item(i).titulo,
                    descricao: responde.rows.item(i).descricao
                });
            }
            $scope.notas= notas;
            console.log(notas);
        }
        function resultError(error){
            alert("error ocorreu: "+error);
        }

        //getNota();
})

.controller('InserirCtrl', function($scope, Notas) {

    $scope.salvar = function(){

        var titulo= document.getElementById("titulo").value;
        var descricao= document.getElementById("descricao").value;

        var  database= window.openDatabase("banco", "1.0", "banco de dados", 200000);
        database.transaction(function(tx){
            novoNota(tx, titulo, descricao);
        }, errorNota, successNota);
    };


    function novoNota(tx, titulo, descricao){

        var now= new Date();
        var data= now.getFullYear()+now.getMonth()+now.getDay();
        var hora= now.getHours()+now.getMinutes()+now.getSeconds();

        query= "INSERT INTO nota ( titulo, descricao, dt_criacao, hr_criacao) VALUES ('"+titulo+"', '"+descricao+"', "+ data +", "+ hora +")";
        //alert(query);
        tx.executeSql(query);
        var nota= [{
            id: 0,
            titulo: titulo,
            descricao: descricao
        }];
        Notas.set(nota);
        //console.log(nota);

    }

    function errorNota(error){
        alert("Erro ao inserir no banco: " + error);
    }

    function successNota(){
        window.history.back();
        //alert("Chamado inserido com sucesso!");
        //window.open("nota.html");
    }



})

;
