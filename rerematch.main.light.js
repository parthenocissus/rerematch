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
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

let generativeEra = function () {

    document.getElementById("js-cont").innerHTML = '';

    const w = 940, margin = 12, distance = 74;
    let params = Simulation.calculateParams(w, margin, distance);
    params.colors.lineColor = "#1D1D1B";
    params.colors.backColor = "#ffffff";
    let styles = Piece.getStyleFat();
    (new Simulation(params, styles)).start();

};

document.addEventListener("DOMContentLoaded", generativeEra);

window.onblur = () => {
    window.onfocus = generativeEra;
};