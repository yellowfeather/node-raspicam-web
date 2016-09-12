<latest-image>
  <div>
    <img src="{imagedata.lastImageUrl}"></img>
    <p>Status: {imagedata.message}</p>
    <p>Started at: {imagedata.startedAt}</p>
    <p>Interval (s): {imagedata.interval}</p>
    <p>Last image taken at: {imagedata.lastImageTakenAt}</p>
    <p>Last image url: {imagedata.lastImageUrl}</p>
  </div>
  <script>
    this.on('mount', function(imagedata){
      console.log("mounted, imagedata: ", imagedata);
    });

    var that = this;
  </script>
</latest-image>
