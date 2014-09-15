/**
 * Created by michaelgarrido on 9/14/14.
 */
Layout = {
    positionsAlongRadius: function( origin, length, angles ){
        var positions = [];
        _.each(angles, function(angle){
            positions.push(positionAlongRadius(_.clone(origin), length, angle));
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
        origin = this.arrayToPoint(origin);

        var positions = [];
        for (var p=0; p<count; p++){
            positions.push([ origin.x+p*width/(count-1)-(width/2), origin.y ]);
        }

        return positions;
    },
    arrayToPoint: function( data ){
        if (Array.isArray(data))
            return {x:data[0],y:data[1]};
        else
            return data
    }
}