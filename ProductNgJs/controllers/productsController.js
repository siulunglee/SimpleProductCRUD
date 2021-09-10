var app = angular.module("MyApp", ["ui.bootstrap"]);
app.controller("MyController", function ($uibModal, $scope, $http, $window) {
  // Getting records from database.

  // dotnet web api url
  $scope.apiUrl = "https://localhost:5001";

  console.log($scope.apiUrl);

  var listReturn = $http({
    url: $scope.apiUrl + "/api/Products",
    method: "GET",
    dataType: "json",
    headers: { "Content-Type": "application/json" },
  });

  listReturn.then(function (response) {
    console.log(response.data);
    $scope.Products = response.data;
  });

  //Adding new record to database.
  $scope.Add = function () {
    if (
      typeof $scope.Sku == "undefined" ||
      typeof $scope.Price == "undefined" ||
      typeof $scope.Name == "undefined" ||
      typeof $scope.Description == "undefined"
    ) {
      return;
    }

    var dataInsert =
      "{Sku: '" +
      $scope.Sku +
      "', Name: '" +
      $scope.Name +
      "', Price: '" +
      $scope.Price +
      "', Description: '" +
      $scope.Description +
      "'}";
    var AddRecord = $http({
      method: "POST",
      url: $scope.apiUrl + "/api/Products",
      data: dataInsert,
      dataType: "json",
      headers: { "Content-Type": "application/json" },
    });
    AddRecord.then(function (response) {
      //The newly inserted record is inserted into the Products array.
      console.log(response.data);
      $scope.Products.push(response.data);
    }).catch(function (err) {
      $window.alert("Cannot Add Record !!");
    });

    // $scope.Sku = "";
    // $scope.Name = "";
    // $scope.Price = "";
    // $scope.Description = "";
  };

  //This variable is used to store the original values.
  $scope.EditItem = {};

  //Editing an existing record.
  $scope.Edit = function (index) {
    //Setting EditMode to TRUE makes the TextBoxes visible for the row.
    $scope.Products[index].EditMode = true;

    //The original values are saved in the variable to handle Cancel case.
    $scope.EditItem.Name = $scope.Products[index].Name;
    $scope.EditItem.Sku = $scope.Products[index].Sku;
    $scope.EditItem.Price = $scope.Products[index].Price;
    $scope.EditItem.Description = $scope.Products[index].Description;
  };

  //Editing an existing record.
  $scope.popupEdit = function (index) {
    //Setting EditMode to TRUE makes the TextBoxes visible for the row.
    //$scope.Products[index].EditMode = true;

    //The original values are saved in the variable to handle Cancel case.
    $scope.EditItem.Name = $scope.Products[index].Name;
    $scope.EditItem.Sku = $scope.Products[index].Sku;
    $scope.EditItem.Price = $scope.Products[index].Price;
    $scope.EditItem.Description = $scope.Products[index].Description;

    console.log($scope.Products[index]);

    $scope.editProducts = $scope.Products[index];
  };

  $scope.editItemPopup = function (index) {
    $uibModal.open({
      templateUrl: "update.html",
      controller: "MyController",
      resolve: {
        uId: function () {
          return index;
        },
      },
    });
  };

  //Cancelling an Edit.
  $scope.Cancel = function (index) {
    // The original values are restored back into the Products Array.
    $scope.Products[index].Name = $scope.EditItem.Name;
    $scope.Products[index].Description = $scope.EditItem.Description;
    $scope.Products[index].Sku = $scope.EditItem.Sku;
    $scope.Products[index].Price = $scope.EditItem.Price;

    //Setting EditMode to FALSE hides the TextBoxes for the row.
    $scope.Products[index].EditMode = false;
    $scope.EditItem = {};
  };

  //Updating an existing record to database.
  $scope.Update = function (index) {
    var Product = $scope.Products[index];

    if (Product == null) {
      return false;
    } else if (Product.Id == null) {
      return false;
    }

    var update = $http({
      method: "PUT",
      url: $scope.apiUrl + "/api/Products/" + Product.Id,
      data: JSON.stringify(Product),
    });

    update.then(function (response) {
      $scope.returnStatus = response.status;
      console.log($scope.returnStatus);
      Product.EditMode = false;
    });
  };

  //Deleting an existing record from database.
  $scope.Delete = function (index) {
    if ($window.confirm("Do you want to delete this row?")) {
      var Product = $scope.Products[index];
      var ProductId = Product.Id;
      var deleteRecord = $http({
        method: "Delete",
        url: $scope.apiUrl + "/api/Products/" + Product.Id,
      });

      deleteRecord
        .then(function (res) {
          $scope.returnStatus = res.status;
          Product.EditMode = false;
          console.log(res.status);
          //Remove the Deleted record from the Products Array.
          $scope.Products = $scope.Products.filter(
            (Product) => Product.Id !== ProductId
          );
          console.log(ProductId + " Deleted");
        })
        .catch(function (err) {
          if (err.status === 404) {
            $window.alert("Cannot delete Record: " + ProductId + " !!");
            $scope.Products = $scope.Products.filter(
              (Product) => Product.Id !== ProductId
            );
            console.log(err.status);
          }
        });
    }
  };
});
