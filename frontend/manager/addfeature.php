<?php
include('includes/config.php');
if(isset($_POST['addfeature']))
{
    $feature = $_POST['feature'];

    $query = "INSERT INTO features('feature') VALUES ('$feature')";
    $query_run = mysqli_query($connection,$query);
     if($query_run)
     {
         echo '<script>alert("Data Saved");</script>';
         header('Location:dashboard.php');
     } 
     else{
         echo '<script>alert("Data not saved");</script>';
     }
    }
    ?>
