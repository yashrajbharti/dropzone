var array = ["One.","Two.","Three.", "Four.", "Five."];
var dropzone = new Dropzone('#demo-upload', {
  previewTemplate: document.querySelector('#preview-template').innerHTML,
  parallelUploads: 1,
  thumbnailHeight: 120,
  thumbnailWidth: 120,
  maxFilesize: 3,
  filesizeBase: 1000,
  thumbnail: function(file, dataUrl) {
    if (file.previewElement) {
      file.previewElement.classList.remove("dz-file-preview");
      var images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
      for (var i = 0; i < images.length; i++) {
        var thumbnailElement = images[i];
        thumbnailElement.alt = file.name;
      //  file.myCustomName = array[1] + file.name.split('.').pop();
        console.log(file.name);
        console.log(array);
        thumbnailElement.src = dataUrl;
      }
      setTimeout(function() { file.previewElement.classList.add("dz-image-preview"); }, 1);
    }
  }
});
Dropzone.autoDiscover = false;
// dropzone.on("sending", function(file) {
//     file.myCustomName = array[1] + file.name.split('.').pop();
//     console.log(file.myCustomName);
// });
// Now fake the file upload, since GitHub does not handle file uploads
// and returns a 404

var minSteps = 6,
    maxSteps = 60,
    timeBetweenSteps = 100,
    bytesPerStep = 100000;

dropzone.uploadFiles = function(files) {
  var self = this;
  for (var i = 0; i < files.length; i++) {

    var file = files[i];
    const url = "https://staging-webservice.supportgenie.io/v3"
    const companyId = '5c01af56830f7879b727607d'
     const formData = new FormData();
            formData.append('someName', file);
            formData.append("company_id", companyId);

    $.ajax({
      url: `${url}/resource/add/v2`,
      type: "POST",
      body: formData,
      success: function(res){
        console.log(res);
      },
      error: function(e){
        console.error(e)
    }
    })
    totalSteps = Math.round(Math.min(maxSteps, Math.max(minSteps, file.size / bytesPerStep)));

    for (var step = 0; step < totalSteps; step++) {
      var duration = timeBetweenSteps * (step + 1);
      setTimeout(function(file, totalSteps, step) {
        return function() {
          file.upload = {
            progress: 100 * (step + 1) / totalSteps,
            total: file.size,
            bytesSent: (step + 1) * file.size / totalSteps
          };

          self.emit('uploadprogress', file, file.upload.progress, file.upload.bytesSent);
          if (file.upload.progress == 100) {
            file.status = Dropzone.SUCCESS;
            self.emit("success", file, 'success', null);
            self.emit("complete", file);
            self.processQueue();
            document.querySelector(".dz-success-mark").style.opacity = "1";
          }
        };
      }(file, totalSteps, step), duration);
    }
  }
}
