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
    document.getElementById("illustration").innerHTML = '';

    const w = 940, margin = 62, distance = 62;
    let params = Simulation.calculateParams(w, margin, distance);
    (new Simulation(params)).start();

    const wi = 511, marginIll = 10, distanceIll = 80;
    let extraParams = Simulation.calculateIllustrationParams(wi, marginIll, distanceIll);
    (new Simulation(extraParams)).illustrate();

};

document.addEventListener("DOMContentLoaded", generativeEra);

window.onblur = () => {
    window.onfocus = generativeEra;
};