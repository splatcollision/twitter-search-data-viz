
/** 
 *  GridObj
 *  
 *  Draw a document grid overlay...
 *  Store coordinates of grid points for snapping...
 *  
 **/

var GridObj = function(gridSize) {

	
	this.gridSize = gridSize;
	this.margin = this.gridSize / 8;
	this.snapTolerance = this.gridSize / 24; // slightly smaller than the margin plz.
	this.active = true;
	
	this.drawLoc = this.margin;
	this.docWidth = document.viewport.getWidth();
	this.docHeight = document.viewport.getHeight();
	this.snapPoints = [this.margin];

	this.canvas = Raphael('grid', this.docWidth, this.docHeight);
	
	// draw vertical grid lines
	while (this.drawLoc < this.docWidth) {
		newR = this.canvas.rect(this.drawLoc + 0.5, 0, this.gridSize, this.docHeight);
		newR.attr({'stroke-width': 1, 'stroke' : '#49545d', 'stroke-dasharray' : '. '});
		this.snapPoints.push(this.drawLoc + this.gridSize); // pre-margin
		this.drawLoc = this.drawLoc + this.gridSize + (this.margin);
		this.snapPoints.push(this.drawLoc);  // post-margin
	}
	// draw horizontal grid lines
	this.drawLoc = this.margin;  // reset our counter...
	while (this.drawLoc < this.docHeight) {
		newR = this.canvas.rect(-1, this.drawLoc + 0.5, this.docWidth, this.gridSize);
		newR.attr({'stroke-width': 1, 'stroke' : '#49545d', 'stroke-dasharray' : '. '});
		this.drawLoc = this.drawLoc + this.gridSize + (this.margin);
	}

	
	this.snapPoint = function(origPoint) {
		
		if (!this.active) return origPoint;
		
		// find closest x and y to original point... with a this.margin tolerance factor...
		var snappedPoint = origPoint;
		var snapLinesPoint = {x: false, y: false};
		//var snapHappened = false;
		
		this.snapPoints.each(function(test){
//			console.log('testing: ' + test + ' diff:' + (snappedPoint.x - test));
			if ('x' in origPoint) {
				if (Math.abs(origPoint.x - test) < (Editor.DocGrid.snapTolerance)) {
//					console.log('found snap point x');
					//snapHappened = true;
					snappedPoint.x = snapLinesPoint.x = test;
				}
			}			
			if ('y' in origPoint) {
				if (Math.abs(origPoint.y - test) < (Editor.DocGrid.snapTolerance)) {
				//	console.log('found snap point');
					//snapHappened = true;
					snappedPoint.y = snapLinesPoint.y = test;
				}
			}
		});
		
		//console.log(snapLinesPoint.x + ' ' + snapLinesPoint.y);
		//console.log(snapLinesPoint.x || snapLinesPoint.y);
		if (!snapLinesPoint.x && this.snapLineX) this.snapLineX.remove();
		if (!snapLinesPoint.y && this.snapLineY) this.snapLineY.remove();		
		if (snapLinesPoint.x || snapLinesPoint.y) this.drawSnapLines(snapLinesPoint); 
		
		return snappedPoint;
		
	}
	
	this.snapValue = function(origVal) {
		
		if (!this.active) return origVal;
		var snappedVal = origVal;
		this.snapPoints.each(function(test){
		//	console.log('snap test:' + origVal + ' ' + (snappedVal - test) + ' ' + Editor.DocGrid.margin);
			if (Math.abs(snappedVal - test) < (Editor.DocGrid.margin)) {
			//	console.log('found snap point');
				snappedVal = test;
			}

		});
		
		return snappedVal;
	};
	
	this.cleanSnapLines = function() {
		if (this.snapLineX) this.snapLineX.remove();
		if (this.snapLineY) this.snapLineY.remove();
		clearTimeout(this.snapTimeout);
	};
	
	this.drawSnapLines = function(point) {
	//	console.log(point);
		if (point.y) {
			var xPath = 'M 0 ' + (point.y + 0.5) + ' L ' + this.docWidth + ' ' + (point.y + 0.5);
			if (this.snapLineX) this.snapLineX.remove();
 			this.snapLineX = this.canvas.path(xPath);
			this.snapLineX.attr({'stroke-width': 1, 'stroke' : '#F00'});	
		}
		if (point.x) {
			var yPath = 'M ' + (point.x + 0.5) + ' 0 L ' + (point.x + 0.5) + ' ' + this.docHeight;
			if (this.snapLineY) this.snapLineY.remove();
 			this.snapLineY = this.canvas.path(yPath);
			this.snapLineY.attr({'stroke-width': 1, 'stroke' : '#F00'});	
		}
		this.snapTimeout = setTimeout(this.cleanSnapLines.bind(this), 4000);
	};
	
//	$('docgrid').addClassName('anim_fadein20');
	
	
}