/*
Author: Uroš Krčadinac, 2021.

www.krcadinac.com

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see https://www.gnu.org/licenses.

*/

class Simulation {

    constructor(params, styles = Piece.getStyleDefault()) {
        this.params = params;
        this.styles = styles;
    }

    static calculateParams(width, margin, gMargin, vertMargin = 3, col = 8) {
        const shiftAdd = (width - (2 * margin) - (2 * gMargin)) / 3,
            unit = shiftAdd / (col - 1),
            gHeight = (2 * vertMargin) + (unit * (col - 1)),
            h = (2 * (gHeight + margin)) + gMargin;
        let params = {
            dim: {w: width, h: h},
            unit: unit,
            margin: margin,
            intro: 10000,
            vertical: {
                margin1: vertMargin,
                margin2: gMargin + gHeight
            },
            divName: "js-cont",
            shift: {
                g1: 0,
                g2: shiftAdd + gMargin,
                g3: 2 * (shiftAdd + gMargin)
            },
            colors: {
                lineColor: "#ffffff",
                backColor: "#1D1D1B",
                sunColor: "#FFB901",
                purpleBlue: "#7301ff",
                violet: "#7F00FF",
                magenta: "#FF01C6",
                red: "#FF3A01",
                salmon: "#ff0153",
                darkSun: "#CD9500",
                purpleGray: "#9b88b2"
            }
        };
        params.colors.otherSideColor = params.colors.salmon;
        return params;
    }

    static calculateIllustrationParams(width, margin, distance, vertMargin = 3, col = 8) {
        const shiftAdd2 = (width - (2 * margin) - distance) / 2,
            unit2 = shiftAdd2 / (col - 1),
            gHeight2 = (2 * vertMargin) + (unit2 * (col - 1)),
            h2 = gHeight2 + (2 * margin);
        let params = {
            dim: {w: width, h: h2},
            unit: unit2,
            margin: margin,
            intro: 0,
            vertical: {margin1: vertMargin},
            divName: "illustration",
            shift: {g1: 0, g2: shiftAdd2 + distance},
            colors: {
                lineColor: "#1D1D1B",
                backColor: "#ffffff",
                sunColor: "#FFB901",
                purpleBlue: "#7301ff",
                violet: "#7F00FF",
                magenta: "#FF01C6",
                red: "#FF3A01",
                salmon: "#ff0153",
                darkSun: "#CD9500",
                purpleGray: "#9b88b2"
            }
        };
        params.colors.otherSideColor = params.colors.salmon;
        return params;
    }

    start() {
        let params = this.params;

        let svg = d3.select("#" + params.divName)
            .append("svg")
            .attr("viewBox", "0 0 " + params.dim.w + " " + params.dim.h)
            .attr("preserveAspectRatio", "xMinYMin meet");
        this.svg = svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", params.dim.w)
            .attr("height", params.dim.h)
            .style("stroke", "none")
            .style("fill", params.colors.backColor);

        let graphics = [
            {
                g: svg.append("g")
                    .attr("transform",
                        "translate(" + params.shift.g1 + ", " + params.vertical.margin1 + ")")
            },
            {
                g: svg.append("g").attr("transform",
                    "translate(" + params.shift.g2 + ", " + params.vertical.margin1 + ")")
            },
            {
                g: svg.append("g").attr("transform",
                    "translate(" + params.shift.g3 + ", " + params.vertical.margin1 + ")")
            },
            {
                g: svg.append("g").attr("transform",
                    "translate(" + params.shift.g1 + ", " + params.vertical.margin2 + ")")
            },
            {
                g: svg.append("g").attr("transform",
                    "translate(" + params.shift.g2 + ", " + params.vertical.margin2 + ")")
            },
            {
                g: svg.append("g").attr("transform",
                    "translate(" + params.shift.g3 + ", " + params.vertical.margin2 + ")")
            }
        ];

        let styles = this.styles;
        let order = [0, 2, 4, 5, 3, 1];

        let zigzagIntro = function () {
            graphics.forEach((element, index) => {
                // const adjustedDelay = 0.6 * delay * index;
                let zz = new ZigZag(element.g, params, params.intro, styles);
                zz.play();
                if (index === graphics.length - 1) {
                    setTimeout(simulate, params.intro * 0.4);
                }
            });
        };
        let simulate = function () {
            let delay = 0;
            for (let i in order) {
                let element = graphics[order[i]];
                let game = new Game(element.g, params, delay, styles);
                delay = game.play();
            }
            order = Simulation.shuffle(order);
            setTimeout(simulate, delay);
        };
        zigzagIntro();

    }

    illustrate() {

        let params = this.params, styles = this.styles;
        let svg = d3.select("#" + params.divName)
            .append("svg")
            .attr("viewBox", "0 0 " + params.dim.w + " " + params.dim.h)
            .attr("preserveAspectRatio", "xMinYMin meet");
        this.svg = svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", params.dim.w)
            .attr("height", params.dim.h)
            .style("stroke", "none")
            .style("fill", params.colors.backColor);

        let graphicsLeft = svg.append("g")
            .attr("id", "left")
            .attr("transform", "translate(" + params.shift.g1 + ", " + params.vertical.margin1 + ")");
        let graphicsRight = svg.append("g")
            .attr("id", "right")
            .attr("transform", "translate(" + params.shift.g2 + ", " + params.vertical.margin1 + ")");

        let simulate = function () {
            let game = new Game(graphicsRight, params, params.intro, styles);
            game.setDoubleGraphics(graphicsLeft);
            const delay = game.play();
            setTimeout(simulate, delay);
        };
        simulate();

    }

    static shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

}

class Board {

    constructor(g, params, delay, styles) {
        this.g = g;
        this.unit = params.unit;
        this.margin = params.margin;
        this.colors = params.colors;
        this.styles = styles;
        this.stepDelay = 0;
        this.playSpeed = {min: 160, max: 250};
        this.double = false;
        let maxDelay = 0, dur = 0;
        this.alternativePieceStyle = {
            r: 7,
            pieceStrokeWidth: 2,
            lineStrokeWidth: 2.2
        };

        if ("paths" in g) {
            maxDelay = 1000;
            dur = 500;
            let paths = this.g.paths, thisBoard = this;
            paths.forEach((path, index) => {
                let l = path.node().getTotalLength();
                path.attr("stroke-dashoffset", 0)
                    .transition()
                    .delay(() => Board.randomInt(delay, delay + maxDelay))
                    .duration(() => dur)
                    .ease(d3.easePolyOut)
                    .attr("stroke-dasharray", l + " " + l)
                    .attr("stroke-dashoffset", l)
                    .remove();
                if (index === paths.length - 1) {
                    thisBoard.g.paths = [];
                }
            });
        } else {
            this.g.paths = [];
        }

        this.delay = delay + maxDelay + dur;
        this.prepare();
    }

    reset(delay) {
        this.g.transition()
            .delay(delay)
            .duration(300)
            .style("opacity", 0);
        this.g.selectAll("*").remove();
        this.prepare();
    }

    doubleGraphics(g2) {
        this.double = true;
        this.frontG = g2.append("g")
            .style("opacity", 0);
        let board = this;
        this.pieces.forEach((piece) => {
            piece.g = board.frontG.append("g");
            piece.restyle(board.alternativePieceStyle);
            piece.prepare();
        });
    }

    prepare() {
        this.backG = this.g.append("g");
        this.frontG = this.g.append("g")
            .style("opacity", 0);
        this.dg = this.g.append("g");
        this.white = true;
        this.board = [];
        this.boardPoints = [];
        this.pieces = [];
        for (let i = 0; i < 8; i++) {
            this.board[i] = [];
            for (let j = 0; j < 8; j++) {
                this.board[i][j] = null;
                this.boardPoints.push({x: i, y: j});
            }
        }
    }

    on() {
        const dur = 400, delayAdd = 100,
            showDelay = this.delay + delayAdd;
        this.frontG.transition()
            .delay(showDelay)
            .duration(dur)
            .style("opacity", 1);
        this.delay = showDelay + dur;
    }

    erasePieces() {
        let eraseDelay = (this.double) ? this.delay + 500 : this.delay;
        this.frontG.transition()
            .delay(eraseDelay)
            .duration(200)
            .style("opacity", 0);
    }

    addPiece(piece) {
        this.pieces.push(piece);
    }

    put(piece) {
        this.board[piece.pos.x][piece.pos.y] = piece;
    }

    putOn(piece, pos) {
        this.board[pos.x][pos.y] = piece;
    }

    get(pos) {
        return this.board[pos.x][pos.y];
    }

    removePiece(piece, delay, duration) {
        const index = this.pieces.indexOf(piece);
        if (index > -1) {
            piece.pieceG.transition()
                .delay(delay)
                .duration(duration)
                .style("opacity", 0);
            this.pieces.splice(index, 1);
        }
    }

    clear(pos) {
        this.board[pos.x][pos.y] = null;
    }

    randomStep() {
        let duration = Board.randomInt(this.playSpeed.min, this.playSpeed.max);
        let pcs = this.pieces.filter(p => (p.white === this.white));
        let result = null;
        do {
            if (pcs.length === 0) return "end";
            let pieceIndex = Math.floor(Math.random() * pcs.length);
            let piece = pcs[pieceIndex];
            result = piece.move(this.delay, duration);
            if (result === "end") return result;
            pcs.splice(pieceIndex, 1);
        } while (result === null);
        this.delay += duration + this.stepDelay;
        this.white = !this.white;
        return "playing";
    }

    stepPieceWithIndex(index) {
        let duration = Board.randomInt(50, 150);
        let piece = this.pieces[index];
        let result = piece.move(this.delay, duration);
        if (result === null) {
            return "end";
        } else {
            this.delay += duration + this.stepDelay;
            return "playing";
        }
    }

    drawBoard() {
        this.dg.selectAll("circle")
            .data(this.boardPoints)
            .enter()
            .append("circle")
            .attr("cx", d => Piece.mapPoint(d.x))
            .attr("cy", d => Piece.mapPoint(d.y))
            .attr("r", 1.2)
            .style("stroke", "none")
            .style("fill", "black");
    }

    static distance(pos1, pos2) {
        const a = pos1.x - pos2.x;
        const b = pos1.y - pos2.y;
        return Math.sqrt((a * a) + (b * b));
    }

    static same(pos1, pos2) {
        return (pos1.x === pos2.x) && (pos1.y === pos2.y);
    }

    static randomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    has(point) {
        return (point.x >= 0) && (point.y >= 0) && (point.x < 8) && (point.y < 8);
    }

    free(possibleP) {
        let value = true;
        this.pieces.forEach(function (piece) {
            if (Board.same(piece.pos, possibleP)) {
                value = false;
            }
        });
        return value;
    }

    takeFrom(possibleP, white) {
        let value = null;
        if (this.has(possibleP)) {
            let piece = this.get(possibleP);
            if (piece !== null)
                if (piece.white !== white)
                    value = piece;
        }
        return value;
    }

}

class Piece {

    constructor(board, startingPoint, white) {
        this.board = board;
        this.pos = startingPoint;
        this.white = white;
        this.lineG = board.backG.append("g");
        this.g = board.frontG.append("g");
        this.mapping = d3.line()
            .x(d => d.x * board.unit + board.margin)
            .y(d => d.y * board.unit + board.margin)
            .curve(d3.curveLinear);
        this.r = board.styles.r;
        this.pieceStrokeWidth = board.styles.pieceStrokeWidth;
        this.lineStrokeWidth = board.styles.lineStrokeWidth;
        this.pieceStrokeColor = white ? board.colors.sunColor : board.colors.otherSideColor;
        this.opacity = 1;
        board.addPiece(this);
    }

    static getStyleDefault() {
        return {r: 9, pieceStrokeWidth: 3, lineStrokeWidth: 2.8};
    }

    static getStyleFat() {
        return {r: 9, pieceStrokeWidth: 3.4, lineStrokeWidth: 3.2};
    }

    static getStyleThin() {
        return {r: 7, pieceStrokeWidth: 2, lineStrokeWidth: 2.2};
    }

    restyle(s) {
        this.r = s.r;
        this.pieceStrokeWidth = s.pieceStrokeWidth;
        this.lineStrokeWidth = s.lineStrokeWidth;
    }

    tracePath(line, delay, duration) {
        let path = this.lineG.append("path")
            .attr("d", this.mapping(line))
            .style("stroke", this.board.colors.lineColor)
            .style("stroke-width", this.lineStrokeWidth)
            .style("fill", "none")
            // .style("shape-rendering", "crispEdges")
            .style("stroke-linecap", "round")
            .style("stroke-linejoin", "round");
        const totalLength = path.node().getTotalLength();
        path.attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .delay(delay)
            .duration(duration)
            .ease(d3.easePolyOut)
            .attr("stroke-dashoffset", 0);
        this.board.g.paths.push(path);
    }

    move(delay, duration) {
        const line = [{x: this.pos.x, y: this.pos.y}];
        this.board.clear(this.pos);
        let possibleMatrix = this.createPossibleMatrix();
        return this.chooseAndUpdate(possibleMatrix, line, delay, duration);
    }

    createPossibleMatrix() {
        const currentPoint = {x: this.pos.x, y: this.pos.y, white: this.white};
        let possibleMatrix = [], brd = this.board,
            middle = this.middle, available = this.available;
        this.genericMatrix.forEach(function (gp) {
            let point = {
                x: gp.y + currentPoint.x - 7,
                y: gp.x + currentPoint.y - 7
            };
            point = middle(point, gp, currentPoint);
            let result = available(brd.pieces, currentPoint, point);
            point.piece = result.piece;
            if (brd.has(point) && result.avail) {
                possibleMatrix.push(point);
            }
        });
        return possibleMatrix;
    }

    available(pieces, currentP, possibleP) {
        let value = {avail: true, piece: null};
        const c = Board.distance(currentP, possibleP);
        pieces.forEach(function (piece) {
            if ((Board.same(piece.pos, possibleP)) && (piece.white !== currentP.white)) {
                value.piece = piece;
            } else if (!Board.same(piece.pos, currentP)) {
                const a = Board.distance(currentP, piece.pos);
                const b = Board.distance(possibleP, piece.pos);
                if (((a + b) - c) < 0.5) {
                    value.avail = false;
                }
            }
        });
        return value;
    };

    chooseAndUpdate(possibleMatrix, line, delay, duration) {
        if (possibleMatrix.length > 0) {
            this.pos = possibleMatrix[Math.floor(Math.random() * possibleMatrix.length)];
            if (this.pos.piece !== null) {
                this.board.removePiece(this.pos.piece, delay, duration);
                if (this.pos.piece instanceof King)
                    return "end";
            }
            this.update(delay);
            line = this.linePush(line, this.pos);
            this.drawPiece(this.pos, delay, duration);
            this.tracePath(line, delay, duration);
            return "playing";
        } else {
            return null;
        }
    }

    drawPiece() {
    }

    update(delay) {
        this.board.putOn(this, this.pos);
    }

    middle(p, generalPoint, currentPoint) {
        return p;
    }

    linePush(line, pos) {
        let newLine = [...line];
        newLine.push({x: pos.x, y: pos.y});
        return newLine;
    }

    mapPoint(p) {
        return p * this.board.unit + this.board.margin;
    }

}

class Pawn extends Piece {

    constructor(board, startingPoint, white) {
        super(board, startingPoint, white);
        this.prepare();
    }

    prepare() {
        this.pieceG = this.g.selectAll("circle")
            .data([this.pos])
            .enter()
            .append("circle")
            .attr("cx", d => this.mapPoint(d.x))
            .attr("cy", d => this.mapPoint(d.y))
            .attr("r", this.r - 1)
            .style("stroke", this.pieceStrokeColor)
            .style("stroke-width", this.pieceStrokeWidth)
            .style("fill", "none");
    }

    drawPiece(pos, delay, duration) {
        let brd = this.board;
        this.pieceG.transition()
            .delay(delay)
            .duration(duration)
            .ease(d3.easePolyOut)
            .attr("cx", this.mapPoint(pos.x))
            .attr("cy", this.mapPoint(pos.y));
        if (this.opacity === 0) {
            this.pieceG.transition()
                .delay(delay + duration)
                .style("opacity", () => {
                    brd.removePiece(this, delay, 0);
                    return 0;
                });
        }
    }

    move(delay, duration) {
        let currentPos = {x: this.pos.x, y: this.pos.y};
        const line = [currentPos];
        this.board.clear(this.pos);

        let possibleMatrix = [];
        const inc = this.white ? -1 : 1;
        const forwardPoint = {x: currentPos.x, y: currentPos.y + inc};
        if ((this.board.has(forwardPoint)) && (this.board.free(forwardPoint))) {
            possibleMatrix.push(forwardPoint);
        }
        const forwLeftPoint = {x: currentPos.x - 1, y: currentPos.y + inc};
        const forwRightPoint = {x: currentPos.x + 1, y: currentPos.y + inc};
        forwLeftPoint.piece = this.board.takeFrom(forwLeftPoint, this.white);
        forwRightPoint.piece = this.board.takeFrom(forwRightPoint, this.white);
        if ((this.board.has(forwLeftPoint)) && (forwLeftPoint.piece !== null)) {
            possibleMatrix.push(forwLeftPoint);
        }
        if ((this.board.has(forwRightPoint)) && (forwRightPoint.piece !== null)) {
            possibleMatrix.push(forwRightPoint);
        }
        const base = this.white ? 6 : 1;
        if (currentPos.y === base) {
            const forwardPoint2 = {x: currentPos.x, y: currentPos.y + (2 * inc)};
            if ((this.board.free(forwardPoint)) && (this.board.free(forwardPoint2))) {
                possibleMatrix.push(forwardPoint2);
            }
        }
        return this.chooseAndUpdate(possibleMatrix, line, delay, duration);
    }

    update(delay) {
        const queenY = this.white ? 0 : 7;
        let pieceToBe = this;
        if (this.pos.y === queenY) {
            this.opacity = 0;
            if (this.board.double) {
                const style = this.board.alternativePieceStyle;
                pieceToBe = new Queen(this.board, this.pos, this.white, delay, true, style);
            } else {
                pieceToBe = new Queen(this.board, this.pos, this.white, delay, true);
            }
        }
        this.board.putOn(pieceToBe, this.pos);
    }

}

class Queen extends Piece {

    constructor(board, startingPoint, white, delay = 0, advance = false, style = null) {
        super(board, startingPoint, white);
        this.genericMatrix = [];
        this.advance = advance;
        this.delay = delay;
        for (let i = 0; i < 15; i++) {
            let vertical = {x: 7, y: i},
                horizontal = {x: i, y: 7},
                diag1 = {x: i, y: i},
                diag2 = {x: 14 - i, y: i};
            if (i !== 7) {
                this.genericMatrix.push(vertical, horizontal, diag1, diag2);
            }
        }
        if (style !== null) {
            this.restyle(style);
        }
        this.prepare();
    }

    prepare() {
        let delay = this.delay;
        this.pieceG = this.g.selectAll("line")
            .data(this.pieceShapeData())
            .enter()
            .append("line")
            .attr("x1", d => d.x1)
            .attr("y1", d => d.y1)
            .attr("x2", d => d.x2)
            .attr("y2", d => d.y2)
            .style("stroke", this.pieceStrokeColor)
            .style("stroke-width", this.pieceStrokeWidth)
            .style("fill", "none")
            .style("opacity", 0);
        this.pieceG.transition()
            .delay(delay)
            .style("opacity", 1);
    }

    drawPiece(pos, delay, duration) {
        this.pieceG = this.pieceG.data(this.pieceShapeData());
        this.pieceG.transition()
            .delay(delay)
            .duration(duration)
            .ease(d3.easePolyOut)
            .attr("x1", d => d.x1)
            .attr("y1", d => d.y1)
            .attr("x2", d => d.x2)
            .attr("y2", d => d.y2);
    }

    pieceShapeData() {
        const l = (this.r / 2) + 3;
        const dim = {x: this.mapPoint(this.pos.x), y: this.mapPoint(this.pos.y)};
        return [
            {x1: dim.x - l, y1: dim.y - l, x2: dim.x + l, y2: dim.y + l},
            {x1: dim.x - l, y1: dim.y + l, x2: dim.x + l, y2: dim.y - l}
        ];
    }
}

class King extends Queen {

    constructor(board, startingPoint, white) {
        super(board, startingPoint, white);
        this.genericMatrix = [];
        for (let i = 6; i < 9; i++) {
            let vertical = {x: 7, y: i},
                horizontal = {x: i, y: 7},
                diag1 = {x: i, y: i},
                diag2 = {x: 14 - i, y: i};
            if (i !== 7) {
                this.genericMatrix.push(vertical, horizontal, diag1, diag2);
            }
        }
    }

    pieceShapeData() {
        const l = (this.r / 2) + 4;
        const dim = {x: this.mapPoint(this.pos.x), y: this.mapPoint(this.pos.y)};
        return [
            {x1: dim.x, y1: dim.y - l, x2: dim.x, y2: dim.y + l},
            {x1: dim.x - l, y1: dim.y, x2: dim.x + l, y2: dim.y}
        ];
    }
}

class Knight extends Piece {

    constructor(board, startingPoint, white) {
        super(board, startingPoint, white);
        this.genericMatrix = [
            {x: 5, y: 6, extra: {x: 6, y: 6}},
            {x: 5, y: 8, extra: {x: 6, y: 8}},
            {x: 9, y: 6, extra: {x: 8, y: 6}},
            {x: 9, y: 8, extra: {x: 8, y: 8}},
            {x: 6, y: 5, extra: {x: 6, y: 6}},
            {x: 8, y: 5, extra: {x: 8, y: 6}},
            {x: 6, y: 9, extra: {x: 6, y: 8}},
            {x: 8, y: 9, extra: {x: 8, y: 8}}];
        this.map = d3.line()
            .x(d => d.x)
            .y(d => d.y)
            .curve(d3.curveLinear);
        this.prepare();
    }

    prepare() {
        this.pieceG = this.g.append("g")
            .append("path")
            .attr("d", this.map(this.pieceShapeData()))
            .style("stroke-linecap", "round")
            .style("stroke-linejoin", "round")
            .style("stroke", this.pieceStrokeColor)
            .style("stroke-width", this.pieceStrokeWidth)
            .style("fill", "none");
    }

    available(pieces, currentP, possibleP) {
        let value = {avail: true, piece: null};
        pieces.forEach(function (piece) {
            if ((Board.same(piece.pos, possibleP)) && (piece.white !== currentP.white)) {
                value.piece = piece;
            } else if ((Board.same(piece.pos, possibleP)) && (piece.white === currentP.white)) {
                value.avail = false;
            }
        });
        return value;
    };

    drawPiece(pos, delay, duration) {
        this.pieceG.transition()
            .delay(delay)
            .duration(duration)
            .ease(d3.easePolyOut)
            .attr("d", this.map(this.pieceShapeData()));
    }

    pieceShapeData() {
        const x = this.r * 2 + 2; //(this.r / 2) + 3;
        const h = x * (Math.sqrt(3) / 2);
        const p = {x: this.mapPoint(this.pos.x), y: this.mapPoint(this.pos.y)};
        return [{x: p.x - x / 2, y: p.y + h / 2},
            {x: p.x + x / 2, y: p.y + h / 2},
            {x: p.x, y: p.y - h / 2},
            {x: p.x - x / 2, y: p.y + h / 2}];
    }

    middle(p, generalPoint, currentPoint) {
        let point = p;
        point.extra = {
            x: generalPoint.extra.y + currentPoint.x - 7,
            y: generalPoint.extra.x + currentPoint.y - 7
        };
        return point;
    }

    linePush(line, pos) {
        let newLine = [...line];
        newLine.push({x: pos.extra.x, y: pos.extra.y});
        newLine.push({x: pos.x, y: pos.y});
        return newLine;
    }

}

class Rook extends Piece {

    constructor(board, startingPoint, white) {
        super(board, startingPoint, white);
        this.genericMatrix = [];
        for (let i = 0; i < 15; i++) {
            let vertical = {x: 7, y: i},
                horizontal = {x: i, y: 7};
            if (i !== 7) {
                this.genericMatrix.push(vertical, horizontal);
            }
        }
        this.prepare();
    }

    prepare() {
        this.pieceG = this.g.selectAll("rect")
            .data(this.pieceShapeData())
            .enter()
            .append("rect")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("width", d => d.w)
            .attr("height", d => d.h)
            .style("stroke", this.pieceStrokeColor)
            .style("stroke-width", this.pieceStrokeWidth)
            .style("fill", "none");
    }

    drawPiece(pos, delay, duration) {
        this.pieceG = this.pieceG.data(this.pieceShapeData());
        this.pieceG.transition()
            .delay(delay)
            .duration(duration)
            .ease(d3.easePolyOut)
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("width", d => d.w)
            .attr("height", d => d.h);
    }

    pieceShapeData() {
        return [{
            x: this.mapPoint(this.pos.x) - this.r,
            y: this.mapPoint(this.pos.y) - this.r,
            w: 2 * this.r,
            h: 2 * this.r
        }];
    }

}

class Bishop extends Piece {

    constructor(board, startingPoint, white) {
        super(board, startingPoint, white);
        this.genericMatrix = [];
        for (let i = 0; i < 15; i++) {
            let diag1 = {x: i, y: i},
                diag2 = {x: 14 - i, y: i};
            if (i !== 7) {
                this.genericMatrix.push(diag1, diag2);
            }
        }
        this.prepare();
    }

    prepare() {
        this.pieceG = this.g.selectAll("rect")
            .data(this.pieceShapeData())
            .enter()
            .append("rect")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("width", d => d.w)
            .attr("height", d => d.h)
            .attr("transform", d => "rotate(45, " + (d.w / 2 + d.x) + ", " + (d.h / 2 + d.y) + ")")
            .style("stroke", this.pieceStrokeColor)
            .style("stroke-width", this.pieceStrokeWidth)
            .style("fill", "none");
    }

    drawPiece(pos, delay, duration) {
        this.pieceG = this.pieceG.data(this.pieceShapeData());
        this.pieceG.transition()
            .delay(delay)
            .duration(duration)
            .ease(d3.easePolyOut)
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("width", d => d.w)
            .attr("height", d => d.h)
            .attr("transform", d => "rotate(45, " + (d.w / 2 + d.x) + ", " + (d.h / 2 + d.y) + ")");
    }

    pieceShapeData() {
        const dim = this.r - 1;
        return [{
            x: this.mapPoint(this.pos.x) - dim,
            y: this.mapPoint(this.pos.y) - dim,
            w: 2 * dim,
            h: 2 * dim
        }];
    }
}

class ZigZag {

    constructor(g, params, delay = 0, styles) {
        this.g = g;
        this.delay = delay;
        this.eraseDelay = 0;
        this.styles = styles;
        this.intrvl = params.intro;
        this.lineColor = params.colors.lineColor;
        this.points = [];
        this.paths = [];
        this.dim = 8;
        const dim = this.dim;
        for (let i = 0; i < dim; i++) {
            for (let j = 0; j < dim; j++) {
                this.points.push({
                    x: i,
                    y: j
                });
            }
        }
        this.genericMatrix = [];
        this.matrixLen = (dim * 2);
        for (let i = 0; i < this.matrixLen; i++) {
            let vertical = {x: dim, y: i},
                horizontal = {x: i, y: dim},
                diag1 = {x: i, y: i},
                diag2 = {x: this.matrixLen - i, y: i};
            if (i !== dim) {
                this.genericMatrix.push(vertical, horizontal, diag1, diag2);
            }
        }
        this.mapping = d3.line()
            .x(d => d.x * params.unit + params.margin)
            .y(d => d.y * params.unit + params.margin)
            .curve(d3.curveLinear);
        this.linesIn = {
            delayMin: this.intrvl * 0.05,
            delayMax: this.intrvl * 0.1,
            durMin: this.intrvl * 0.2,
            durMax: this.intrvl * 0.25
        };
        this.linesOut = {
            delayMin: this.intrvl * 0.4,
            delayMax: this.intrvl * 0.75,
            durMin: this.intrvl * 0.1,
            durMax: this.intrvl * 0.25
        };
        this.num = {min: 8, max: 36};
        this.vert = {min: 1, max: 5};
    }

    notUsed(point, wp) {
        let value = false;
        wp.forEach(function (item) {
            if (item === undefined) {
                return pMatrix;
            } else if ((item.x === point.x) && (item.y === point.y)) {
                value = true;
            }
        });
        return value;
    }

    pointMatrix(p, wp) {
        const dim = this.dim;
        let pMatrix = [];
        let notUsed = this.notUsed;
        if (p === undefined) return pMatrix;
        this.genericMatrix.forEach(function (gp) {
            let a = {
                x: gp.x + p.x - dim,
                y: gp.y + p.y - dim
            };
            if ((a.x >= 0) && (a.y >= 0) && (a.x < dim) && (a.y < dim) && notUsed(a, wp)) {
                pMatrix.push(a);
            }
        });
        return pMatrix;
    }

    cleanArray(array, p) {
        if (p === undefined) return array;
        array.forEach(function (item, index) {
            if ((p.x === item.x) && (p.y === item.y)) {
                array.splice(index, 1);
            }
        });
        return array;
    }

    generateLines() {
        const lineCount = Board.randomInt(this.num.min, this.num.max);
        let lines = [];
        let workingPoints = [...this.points]; // JSON.parse(JSON.stringify(points));
        for (let i = 0; i < lineCount; i++) {
            let line = [];
            let n = Board.randomInt(this.vert.min, this.vert.max);
            let index = Math.floor(Math.random() * workingPoints.length);
            let current = workingPoints[index];
            workingPoints.splice(index, 1);
            line.push(current);
            for (let j = 0; j < n; j++) {
                let pMatrix = this.pointMatrix(current, workingPoints);
                let ind = Math.floor(Math.random() * pMatrix.length);
                current = pMatrix[ind];
                if (current !== undefined) {
                    line.push(current);
                    workingPoints = this.cleanArray(workingPoints, current);
                }
            }
            if (line.length > 1) {
                lines.push(line);
            }
        }
        return lines;
    }

    play() {
        let graphics = this.g.append("g"), mapping = this.mapping;
        let lineColor = this.lineColor, styles = this.styles;
        let lin = this.linesIn, lout = this.linesIn, paths = this.paths;
        this.generateLines().forEach(function (line, index) {
            let pth = graphics.append("path")
                .attr("d", mapping(line))
                .style("fill", "none")
                .style("stroke", lineColor)
                .style("stroke-width", styles.lineStrokeWidth);
            let totalLength = pth.node().getTotalLength();
            pth.attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .delay(Board.randomInt(lin.delayMin, lin.delayMax))
                .duration(Board.randomInt(lin.durMin, lin.durMax))
                .ease(d3.easePolyOut)
                .attr("stroke-dashoffset", 0);
            paths.push(pth);
        });
        this.g.paths = paths;
        return this.g;
    }

}

class Game {

    constructor(g, params, delay, styles) {
        this.nSteps = 130;
        this.chessboard = new Board(g, params, delay, styles);
        this.setPieces();
        this.virgin = true;
    }

    setPieces() {
        let chessboard = this.chessboard;
        for (let i = 0; i < 8; i++)
            chessboard.put(new Pawn(chessboard, {x: i, y: 1}, false));
        chessboard.put(new Rook(chessboard, {x: 0, y: 0}, false));
        chessboard.put(new Knight(chessboard, {x: 1, y: 0}, false));
        chessboard.put(new Bishop(chessboard, {x: 2, y: 0}, false));
        chessboard.put(new Queen(chessboard, {x: 3, y: 0}, false));
        chessboard.put(new King(chessboard, {x: 4, y: 0}, false));
        chessboard.put(new Bishop(chessboard, {x: 5, y: 0}, false));
        chessboard.put(new Knight(chessboard, {x: 6, y: 0}, false));
        chessboard.put(new Rook(chessboard, {x: 7, y: 0}, false));
        for (let i = 0; i < 8; i++)
            chessboard.put(new Pawn(chessboard, {x: i, y: 6}, true));
        chessboard.put(new Rook(chessboard, {x: 0, y: 7}, true));
        chessboard.put(new Knight(chessboard, {x: 1, y: 7}, true));
        chessboard.put(new Bishop(chessboard, {x: 2, y: 7}, true));
        chessboard.put(new Queen(chessboard, {x: 3, y: 7}, true));
        chessboard.put(new King(chessboard, {x: 4, y: 7}, true));
        chessboard.put(new Bishop(chessboard, {x: 5, y: 7}, true));
        chessboard.put(new Knight(chessboard, {x: 6, y: 7}, true));
        chessboard.put(new Rook(chessboard, {x: 7, y: 7}, true));
        this.chessboard = chessboard;
    }

    setDoubleGraphics(g2) {
        this.chessboard.doubleGraphics(g2);
    }

    reset(delay) {
        if (!this.virgin) {
            this.chessboard.reset(delay);
            this.setPieces();
        } else {
            this.virgin = false;
        }
    }

    play() {
        this.chessboard.on();
        for (let i = 0; i < this.nSteps; i++) {
            const result = this.chessboard.randomStep();
            if ((result === "end") || (i === this.nSteps - 1)) {
                this.chessboard.erasePieces();
                return this.chessboard.delay;
            }
        }
    }

}