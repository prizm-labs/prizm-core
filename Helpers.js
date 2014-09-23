/**
 * Created by michaelgarrido on 9/14/14.
 */
Layout = {
    positionsAlongRadius: function( origin, length, angles ){
        var self = this;
        var positions = [];
        _.each(angles, function(angle){
            positions.push(self.positionAlongRadius(_.clone(origin), length, angle));
        });

        return positions;
    },


    positionAlongRadius: function( origin, length, angle ){
        origin = this.arrayToPoint(origin);

        var x = Math.sin(angle)*length;
        var y = Math.cos(angle)*length;

        return [ origin.x+Math.round(x), origin.y-Math.round(y), angle ];
    },

    distributePositionsAcrossWidth: function( origin, count, width ){

        var positions = [];

        if (count==1){
            positions.push(origin);
        } else {
            origin = this.arrayToPoint(origin);
            for (var p=0; p<count; p++){
                positions.push([ origin.x+p*width/(count-1)-(width/2), origin.y ]);
            }
        }

        return positions;
    },
    arrayToPoint: function (data) {
        if (Array.isArray(data))
            return {x:data[0],y:data[1]};
        else
            return data
    },
    randomPositionNear: function( origin, radius ){
        origin = this.arrayToPoint(origin);

        // Random angle
        var angle = Math.PI*2*Math.random();
        // Random distance from radius
        var distance = radius*Math.random();

        return {
            x:origin.x+distance*Math.sin(angle),
            y:origin.y+distance*Math.cos(angle)
        }
    }
}

Colors = {
    stringToHex: function(color){
        if (typeof color === 'string') {
            color = parseInt(color.replace(/^#/, ''), 16);
        }
        console.log('color converter to hex', color);
        return color;
    },
    hexToString: function(){

    }
}