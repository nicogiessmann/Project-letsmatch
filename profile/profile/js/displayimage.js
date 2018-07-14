var imageinput = document.getElementById("file");
var imageshow = document.getElementById("profileimage");

const max = 1500; //max size of image

function displayImage() {

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
        var reader = new FileReader();
        reader.readAsDataURL(imageinput.files[0]);

        reader.onload = function (e) {

            var base64image = reader.result;

            resizeDataURL(base64image);
            
            image_uploaded = 2;       
        }

    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
}

function resizeDataURL(database64) {


    //Convert Base64 to Image-Type
    var img = new Image();
    img.src = database64;

    //Wait until creation is finished
    img.onload = function () {

        //save dimension of image
        var width = this.width,
            height = this.height;

        //console.log(width+"x"+height);


        //make width and height equal
        if (width > height) {
            width = height;
        } else {
            height = width;
        }

        //get x and y offset
        var xabs = (this.width - width) / 2,
            yabs = (this.height - height) / 2;

        //init canvas and context
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

            
        if(width<=max){
            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, -xabs, -yabs, this.width, this.height);
        }   
        else{

            canvas.width = max;
            canvas.height = max;

            var scale = max/width;

            ctx.scale(scale, scale);
            ctx.drawImage(img, -xabs, -yabs, this.width, this.height);

        } 

        
        var resizedImage = canvas.toDataURL("image/jpeg", 0.92);

        imageshow.src = resizedImage;
        
        image = resizedImage;
    }
}