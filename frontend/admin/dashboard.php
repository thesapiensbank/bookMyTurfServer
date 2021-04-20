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
$website=$_POST['website'];

$mobileno=$_POST['mobileno'];
$address=$_POST['address'];

$sports=$_POST['sports'];
$features=$_POST['features'];


if(move_uploaded_file($file_loc,$folder.$final_file))
	{
		$image=$final_file;
    }
$notitype='Create Account';
$reciver='Admin';
$sender=$name;

$sqlnoti="insert into notification (notiuser,notireciver,notitype) values (:notiuser,:notireciver,:notitype)";
$querynoti = $dbh->prepare($sqlnoti);
$querynoti-> bindParam(':notiuser', $sender, PDO::PARAM_STR);
$querynoti-> bindParam(':notireciver',$reciver, PDO::PARAM_STR);
$querynoti-> bindParam(':notitype', $notitype, PDO::PARAM_STR);
$querynoti->execute();    
    
$sql ="INSERT INTO users(name, website, mobile,address,  image, sports,features, status) VALUES(:name, :website, :mobileno,:address, :image,:sports,:features, 1)";
$query= $dbh -> prepare($sql);
$query-> bindParam(':name', $name, PDO::PARAM_STR);
$query-> bindParam(':website', $website, PDO::PARAM_STR);


$query-> bindParam(':mobileno', $mobileno, PDO::PARAM_STR);
$query-> bindParam(':address', $address, PDO::PARAM_STR);

$query-> bindParam(':image', $image, PDO::PARAM_STR);
$query-> bindParam(':sports', $sports, PDO::PARAM_STR);
$query->bindParam(':features', $features, PDO::PARAM_STR);
$query->execute();
$lastInsertId = $dbh->lastInsertId();
if($lastInsertId)
{
echo "<script type='text/javascript'>alert('Registration Sucessfull!');</script>";
echo "<script type='text/javascript'> document.location = 'dashboard.php'; </script>";
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
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCaTMnCZFlpS6uPWkI-oA8CB9PiRyuswY0 sensor=false">
</script>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js">
</script>
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
var map;
var marker;
var myLatlng = new google.maps.LatLng(20.268455824834792,85.84099235520011);
var geocoder = new google.maps.Geocoder();
var infowindow = new google.maps.InfoWindow();
function initialize(){
var mapOptions = {
zoom: 18,
center: myLatlng,
mapTypeId: google.maps.MapTypeId.ROADMAP
};

map = new google.maps.Map(document.getElementById("myMap"), mapOptions);

marker = new google.maps.Marker({
map: map,
position: myLatlng,
draggable: true 
}); 

geocoder.geocode({'latLng': myLatlng }, function(results, status) {
if (status == google.maps.GeocoderStatus.OK) {
if (results[0]) {
$('#latitude,#longitude').show();
$('#address').val(results[0].formatted_address);
$('#latitude').val(marker.getPosition().lat());
$('#longitude').val(marker.getPosition().lng());
infowindow.setContent(results[0].formatted_address);
infowindow.open(map, marker);
}
}
});

google.maps.event.addListener(marker, 'dragend', function() {

geocoder.geocode({'latLng': marker.getPosition()}, function(results, status) {
if (status == google.maps.GeocoderStatus.OK) {
if (results[0]) {
$('#address').val(results[0].formatted_address);
$('#latitude').val(marker.getPosition().lat());
$('#longitude').val(marker.getPosition().lng());
infowindow.setContent(results[0].formatted_address);
infowindow.open(map, marker);
}
}
});
});

}
google.maps.event.addDomListener(window, 'load', initialize);
</script>

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

<style>
.map-responsive{
    overflow:hidden;
    padding-bottom:56.25%;
    position:relative;
    height:0;
}
.map-responsive iframe{
    left:0;
    top:0;
    height:100%;
    width:100%;
    position:absolute;
}
#myMap {
   height: 350px;
   width: 680px;
}
</style>
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
                       
                         <div class="col-sm-6">
                         <div class="form-group">
      <label for="name control-label">Name:</label>
      <input type="text" class="form-control" name="name" required="true">
    </div>
    <div class="form-group">
      <label for="website control-label">Website:</label>
      <input type="text" class="form-control" name="website" required="true">
    </div>
                           
    <div class="form-group">
      <label for="phone control-label">Phone no:</label>
      <input type="number" class="form-control" name="mobileno" required="true">
    </div>
</div>
</div>
<div class="row">
<div class="col-sm-6">
<label for="website">Location:</label>
<input id="address" type="text"><br/>
<input type="text" id="latitude" placeholder="Latitude"/>
<input type="text" id="longitude" placeholder="Longitude" />
    <div class="form-group control-label">
<div class="map-responsive">
<div id="myMap"></div>

</div>
</div>
</div>

<div class="col-sm-5">
                         <div class="form-group">
      <label for="address">address line 1:</label>
      <input type="text" class="form-control" name="address" required="true">
    </div>
    <div class="form-group">
      <label for="address">address line 2:</label>
      <input type="text" class="form-control" name="address" required="true">
    </div>
    <div class="row">
              <div class="col-sm-4">             
    <div class="form-group ">
      <label for="address">city:</label>
      <input type="text" class="form-control" name="address" required="true">
    </div>
    </div>

    <div class="col-sm-4">             
    <div class="form-group">
      <label for="phone control-label">Pincode:</label>
      <input type="text" class="form-control" name="address" required="true">
    </div>
    </div>
    </div>
    
    <div class="dropdown">
  <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Dropdown Example
  <span class="caret"></span></button>
  <ul class="dropdown-menu">
    <li><a href="#">HTML</a></li>
    <li><a href="#">CSS</a></li>
    <li><a href="#">JavaScript</a></li>
  </ul>
</div>
    
    </div>
</div>
<!--<div class="col-sm-6">
<label for="sports">sports:</label><br>
<div class="col-sm-3">
  <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
  <label for="vehicle1"> I have a bike</label><br>
  <input type="checkbox" id="vehicle2" name="vehicle2" value="Car">
  <label for="vehicle2"> I have a car</label><br>
  <input type="checkbox" id="vehicle3" name="vehicle3" value="Boat">
  <label for="vehicle3"> I have a boat</label>
  <input type="checkbox" id="vehicle3" name="vehicle3" value="Boat">
  <label for="vehicle3"> I have a boat</label>
</div>
<div class="col-sm-3">
  <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
  <label for="vehicle1"> I have a bike</label><br>
  <input type="checkbox" id="vehicle2" name="vehicle2" value="Car">
  <label for="vehicle2"> I have a car</label><br>
  <input type="checkbox" id="vehicle3" name="vehicle3" value="Boat">
  <label for="vehicle3"> I have a boat</label>
  <input type="checkbox" id="vehicle3" name="vehicle3" value="Boat">
  <label for="vehicle3"> I have a boat</label>
</div>
</div>
<div class="col-sm-6">
<label for="sports">Features:</label><br>
<div class="col-sm-3">
  <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
  <label for="vehicle1"> I have a bike</label><br>
  <input type="checkbox" id="vehicle2" name="vehicle2" value="Car">
  <label for="vehicle2"> I have a car</label><br>
  <input type="checkbox" id="vehicle3" name="vehicle3" value="Boat">
  <label for="vehicle3"> I have a boat</label>
  <input type="checkbox" id="vehicle3" name="vehicle3" value="Boat">
  <label for="vehicle3"> I have a boat</label>
</div>
<div class="col-sm-3">
  <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
  <label for="vehicle1"> I have a bike</label><br>
  <input type="checkbox" id="vehicle2" name="vehicle2" value="Car">
  <label for="vehicle2"> I have a car</label><br>
  <input type="checkbox" id="vehicle3" name="vehicle3" value="Boat">
  <label for="vehicle3"> I have a boat</label>
  <input type="checkbox" id="vehicle3" name="vehicle3" value="Boat">
  <label for="vehicle3"> I have a boat</label>
</div>
</div>-->

<lable class="col-sm-1 control-label">Sports</lable> &nbsp&nbsp
							<input type="checkbox" id="sports" name="sports" value="Football">
  <label  for="sports"> Football</label>
  <input  type="checkbox" id="sports" name="sports" value="Cricket">
  <label for="sports">Cricket</label>
  <input type="checkbox" id="sports" name="sports" value="Hockey">
  <label for="sports">Hockey</label>
  <input type="checkbox" id="sports" name="sports" value="tennis">
  <label for="sports">Tennis</label>
  <input type="checkbox" id="sports" name="sports" value="Badminton">
  <label for="sports">Badminton</label>
  <input type="checkbox" id="sports" name="sports" value="Basketball">
  <label for="sports">Basketball</label>
  <input type="checkbox" id="sports" name="sports" value="cycling">
  <label for="sports">cycling</label>
  <input type="checkbox" id="sports" name="sports" value="baseball">
  <label for="sports">Baseball</label>

  <div class="form-group">
  <div class="row">
  <lable class="col-sm-1 control-label">&nbsp&nbsp&nbsp&nbspFeatures</lable> <button class="btn btn-success btn-lg" data-toggle="modal" data-target="#modalForm">
    Open Contact Form
</button>

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
<div class="col-sm-6">
 
<div class="form-group">
      <label for="address">Images:</label>
      <input type="file" name="image" class="form-control">
    </div>
    </div>
                           

						
							
  <div class="form-group">


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