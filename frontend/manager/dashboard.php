<?php
include('includes/config.php');
if(isset($_POST['submit']))
{

$file = $_FILES['image']['name'];
$file_loc = $_FILES['image']['tmp_name'];
$folder="images/"; 
$new_file_name = strtolower($file);
$final_file=str_replace(' ','-',$new_file_name);

$name=$_POST['name'];


$mobileno=$_POST['mobileno'];

$sports=$_POST['sports'];
$features=$_POST['features'];


if(move_uploaded_file($file_loc,$folder.$final_file))
	{
		$image=$final_file;
    }
$notitype='Create Account';
$reciver='manager';
$sender=$name;

$sqlnoti="insert into notification (notiuser,notireciver,notitype) values (:notiuser,:notireciver,:notitype)";
$querynoti = $dbh->prepare($sqlnoti);
$querynoti-> bindParam(':notiuser', $sender, PDO::PARAM_STR);
$querynoti-> bindParam(':notireciver',$reciver, PDO::PARAM_STR);
$querynoti-> bindParam(':notitype', $notitype, PDO::PARAM_STR);
$querynoti->execute();    
    
$sql ="INSERT INTO users(name, mobile,  image, sports,features, status) VALUES(:name,  :mobileno, :image,:sports,:features, 1)";
$query= $dbh -> prepare($sql);
$query-> bindParam(':name', $name, PDO::PARAM_STR);


$query-> bindParam(':mobileno', $mobileno, PDO::PARAM_STR);

$query-> bindParam(':image', $image, PDO::PARAM_STR);
$query-> bindParam(':sports', $sports, PDO::PARAM_STR);
$query->bindParam(':features', $features, PDO::PARAM_STR);
$query->execute();
$lastInsertId = $dbh->lastInsertId();
if($lastInsertId)
{
echo "<script type='text/javascript'>alert('Registration Sucessfull!');</script>";
echo "<script type='text/javascript'> document.location = 'index.php'; </script>";
}
else 
{
$error="Something went wrong. Please try again";
}

}
?>

<!doctype html>
<html lang="en" class="no-js">

<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
	<meta name="description" content="">
	<meta name="author" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
  <meta charset="utf-8">

	
	<link rel="stylesheet" href="css/font-awesome.min.css">
	<link rel="stylesheet" href="css/bootstrap.min.css">
	<link rel="stylesheet" href="css/dataTables.bootstrap.min.css">
	<link rel="stylesheet" href="css/bootstrap-social.css">
	<link rel="stylesheet" href="css/bootstrap-select.css">
	<link rel="stylesheet" href="css/fileinput.min.css">
	<link rel="stylesheet" href="css/awesome-bootstrap-checkbox.css">
	<link rel="stylesheet" href="css/style.css">
    <script type="text/javascript">

	function validate()
        {
            var extensions = new Array("jpg","jpeg");
            var image_file = document.regform.image.value;
            var image_length = document.regform.image.value.length;
            var pos = image_file.lastIndexOf('.') + 1;
            var ext = image_file.substring(pos, image_length);
            var final_ext = ext.toLowerCase();
            for (i = 0; i < extensions.length; i++)
            {
                if(extensions[i] == final_ext)
                {
                return true;
                
                }
            }
            alert("Image Extension Not Valid (Use Jpg,jpeg)");
            return false;
        }
        
</script>
</head>

<body>
<?php include('includes/header.php');?>
	<div class="ts-main-content">
	<?php include('includes/leftbar.php');?>
		<div class="content-wrapper">
			<div class="container-fluid">
				<div class="row">
					<div class="col-md-12">
						<div class="row">
							<div class="col-md-12">
          
						<div class="well row pt-2x pb-3x bk-light text-left">
                         <form method="post" class="form-horizontal" enctype="multipart/form-data" name="regform" onSubmit="return validate();">
                            <div class="form-group">
                            <label class="col-sm-1 control-label">Name<span style="color:red">*</span></label>
                            <div class="col-sm-5">
                            <input type="text" name="name" class="form-control" required>
                            </div>
                           

                           

                            <label class="col-sm-1 control-label">Phone<span style="color:red">*</span></label>
                            <div class="col-sm-5">
                            <input type="number" name="mobileno" class="form-control" required>
                            </div>
                            </div>


       
 
<div class="form-group">
                            <label class="col-sm-1 control-label">Images<span style="color:red">*</span></label>
                            <div class="col-sm-5">
                            <div><input type="file" name="image" class="form-control"></div>
                            </div>
                            </div>
	</div>
							<div class="form-group">
								<lable class="col-sm-1 control-label">Sports</lable> &nbsp&nbsp
							<input type="checkbox" id="sports" name="sports" value="Football">
  <label  for="sports"> Football</label>
  <input  type="checkbox" id="sports" name="sports" value="Cricket">
  <label for="sports">Cricket</label>
  <input type="checkbox" id="sports" name="sports" value="Hockey">
  <label for="sports">Hockey</label>
  <input type="checkbox" id="sports" name="sports" value="Hockey">
  <label for="sports">Tennis</label>
  <input type="checkbox" id="sports" name="sports" value="Hockey">
  <label for="sports">Badminton</label>
  <input type="checkbox" id="sports" name="sports" value="Hockey">
  <label for="sports">Basketball</label>
  <input type="checkbox" id="sports" name="sports" value="Hockey">
  <label for="sports">cycling</label>
  <input type="checkbox" id="sports" name="sports" value="Hockey">
  <label for="sports">Baseball</label>
	</div>
  <div class="form-group">
  <div class="row">
  <lable class="col-sm-1 control-label">&nbsp&nbsp&nbsp&nbspFeatures</lable>

  </div>
</div>
  <div class=col-sm-2>
  <div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="features" name="features" value="option1">
  <label class="form-check-label" for="features">Wifi</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox"id="features" name="features" value="option2">
  <label class="form-check-label" for="features">First Aid</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="features" name="features" value="option3">
  <label class="form-check-label" for="features">Drinking Water</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="features" name="features" value="option3" >
  <label class="form-check-label" for="features">Parking</label>
</div>
</div>
<div class="row">
  <div class=col-sm-2>
  <div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="features" name="features" value="option1">
  <label class="form-check-label" for="features">Beverages</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="features" name="features" value="option2">
  <label class="form-check-label" for="features">Toilets</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="features" name="features" value="option3" >
  <label class="form-check-label" for="features">Drinking water</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="features" name="features" value="option3" >
  <label class="form-check-label" for="features">Coaching</label>
</div>
</div>
</div>
</div>
  
<button class="btn btn-primary" name="submit" type="submit">Register</button>
                                </form>
                                <br>
                                <br>
                                <br>
                                <br>
								<p>Already Have Account? <a href="index.php" >Signin</a></p>
							</div>
						</div>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Loading Scripts -->
	<script src="js/jquery.min.js"></script>
	<script src="js/bootstrap-select.min.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<script src="js/jquery.dataTables.min.js"></script>
	<script src="js/dataTables.bootstrap.min.js"></script>
	<script src="js/Chart.min.js"></script>
	<script src="js/fileinput.js"></script>
	<script src="js/chartData.js"></script>
	<script src="js/main.js"></script>

</body>
</html>