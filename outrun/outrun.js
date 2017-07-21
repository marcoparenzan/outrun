var speed = 0;
var accellerating = false;
var breaking = false;
var steering_left = false;
var steering_right = false;

var accellerate = function () {
    if (speed >= 20) return;
    speed += 0.1;
};

var decelerate = function () {
    if (speed <= 0) return;
    speed -= 0.05;
};

var breaks = function () {
    if (speed <= 0) return;
    speed -= 0.2;
};

var steer_left = function () {
    if (speed <= 0) return;
};

var steer_right = function () {
    if (speed <= 0) return;
};

document.onkeydown = function (e) {
    e = e || window.event;
    if (e.keyCode == '38') {
        // up arrow
        if (accellerating != true) accellerating = true;
    }
    else if (e.keyCode == '40') {
        // down arrow
        if (breaking != true) breaking = true;
    }
    else if (e.keyCode == '37') {
        // left arrow
        if (steering_left != true) steering_left = true;
    }
    else if (e.keyCode == '39') {
        // right arrow
        if (steering_right != true) steering_right = true;
    }
};

document.onkeyup = function (e) {
    e = e || window.event;
    if (e.keyCode == '38') {
        // up arrow
        if (accellerating == true) accellerating = false;
    }
    else if (e.keyCode == '40') {
        // down arrow
        if (breaking == true) breaking = false;
    }
    else if (e.keyCode == '37') {
        // left arrow
        if (steering_left == true) steering_left = false;
    }
    else if (e.keyCode == '39') {
        // right arrow
        if (steering_right == true) steering_right = false;
    }
};

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var ferrariImage = new Image();
ferrariImage.src = "assets/ferrari.png";

// sky

var skyColor = "cyan";

// perspective

var field_view_width = 640;
var field_view_height = 320;
var vanish_point_height = 400;

// stripes
var stripe_offset_width = 64;
var stripe_offset_step = 1;
var border_width = 8;

var stripe_offset = 0;
var stripe_colors_index = 0;

var color_sets = [{
    "grass": "green",
    "border": "red",
    "road": "lightgray"
},
{
    "grass": "lightgreen",
    "border": "white",
    "road": "gray"
}];

background(true);
foreground(true);

setInterval(function () {

    if (accellerating == true) {
        accellerate();
    }
    else {
        decelerate();
    }
    if (breaking == true) {
        breaks();
    }

    if (speed <= 0) return;
    for (var i = 1; i < speed; i++) {
        background(false);
        foreground(false);
    }
    background(true);
    foreground(true);
}, 20);

function foreground(draw) {
    if (draw) {
        ferrari();
    }
}

var ferrari_x = 400;
var ferrari_y = 600;
var ferrari_animation = 0;
var ferrari_zoom = 3;

function ferrari() {
    if (steering_right) {
        ctx.drawImage(ferrariImage, 7, 240, 124, 44, ferrari_x, ferrari_y, 124 * ferrari_zoom, 44 * ferrari_zoom);
    }
    else if (steering_left) {
        ctx.drawImage(ferrariImage, 198, 350, 124, 44, ferrari_x, ferrari_y, 124 * ferrari_zoom, 44 * ferrari_zoom);
    }
    else {
        ctx.drawImage(ferrariImage, 7 + ferrari_animation * 88, 70, 88, 44, ferrari_x, ferrari_y, 88 * ferrari_zoom, 44 * ferrari_zoom);
        ferrari_animation = (ferrari_animation + 2) % 2;
    }
}

function background(draw) {
    // initialize

    // stripes start
    var y_stripe_offset = stripe_offset;
    var y_stripe_colors_index = stripe_colors_index;

    var horizont_y = canvas.height - field_view_height;
    var l_angle = 1.2;
    var r_angle = l_angle;
    // similar triangle proportion
    var xx1 = canvas.width/2-(vanish_point_height*(vanish_point_height-field_view_height)*2/field_view_width);
    var xx2 = canvas.width - xx1;

    var llx = xx1;
    var llx2 = llx + border_width;
    var rrx = xx2;
    var rrx2 = rrx - border_width;
    var y = horizont_y;

    // set top
    var llx_ = llx;
    var llx2_ = llx2;
    var rrx_ = rrx;
    var rrx2_ = rrx2;
    var y_ = y;

    // road

    while (true) {

        if (y_stripe_offset >= stripe_offset_width) {

            var colors = color_sets[y_stripe_colors_index];

            if (draw) {
                // left grass
                ctx.beginPath();
                ctx.moveTo(0, y_);
                ctx.lineTo(llx_, y_);
                ctx.lineTo(llx, y);
                ctx.lineTo(0, y);
                ctx.closePath();
                ctx.fillStyle = colors.grass;
                ctx.fill();

                // left border
                ctx.beginPath();
                ctx.moveTo(llx_, y_);
                ctx.lineTo(llx2_, y_);
                ctx.lineTo(llx2, y);
                ctx.lineTo(llx, y);
                ctx.closePath();
                ctx.fillStyle = colors.border;
                ctx.fill();

                // road
                ctx.beginPath();
                ctx.moveTo(llx2_, y_);
                ctx.lineTo(rrx2_, y_);
                ctx.lineTo(rrx2, y);
                ctx.lineTo(llx2, y);
                ctx.closePath();
                ctx.fillStyle = colors.road;
                ctx.fill();

                // right border
                ctx.beginPath();
                ctx.moveTo(rrx2_, y_);
                ctx.lineTo(rrx_, y_);
                ctx.lineTo(rrx, y);
                ctx.lineTo(rrx2, y);
                ctx.closePath();
                ctx.fillStyle = colors.border;
                ctx.fill();

                // right grass
                ctx.beginPath();
                ctx.moveTo(rrx_, y_);
                ctx.lineTo(canvas.width, y_);
                ctx.lineTo(canvas.width, y);
                ctx.lineTo(rrx, y);
                ctx.closePath();
                ctx.fillStyle = colors.grass;
                ctx.fill();
            }

            // set new top
            llx_ = llx;
            llx2_ = llx2;
            rrx_ = rrx;
            rrx2_ = rrx2;
            y_ = y;

            y_stripe_offset = 0;
            y_stripe_colors_index = 1 - y_stripe_colors_index;
        }

        y_stripe_offset += stripe_offset_step;

        llx -= l_angle;
        llx2 = llx + border_width;
        rrx += r_angle;
        rrx2 = rrx - border_width;
        y++;
        if (y >= canvas.height) break;
    }

    // close road

    stripe_offset -= stripe_offset_step;
    if (stripe_offset < 0) {
        stripe_offset = stripe_offset_width - 1;
        stripe_colors_index = 1 - stripe_colors_index;
    }

    // sky

    ctx.fillStyle = skyColor;
    ctx.fillRect(0, 0, canvas.width, horizont_y);

    // hud

    ctx.strokeText(parseInt(speed * 9.5) + "MPH", 10, 10);
}