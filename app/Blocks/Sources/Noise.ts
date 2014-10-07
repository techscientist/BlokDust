/// <reference path="../../refs.ts" />

import IBlock = require("../IBlock");
import Block = require("../Block");
import IModifier = require("../IModifier");
import Modifiable = require("../Modifiable");

class Noise extends Modifiable {

    public Noise: Tone.Noise;
    public Envelope: Tone.Envelope;
    public OutputGain: GainNode;
    public params: {
        noise: {
            waveform: string;
        }
        envelope: {
            attack: number;
            decay: number;
            sustain: number;
            release: number;
        }
        output: {
            volume: number;
        }
    };

    constructor(ctx:CanvasRenderingContext2D, position: Point) {
        super(ctx, position);

        this.params = {
            noise: {
                waveform: 'brown'
            },
            envelope: {
                attack: 0.02,
                decay: 0.5,
                sustain: 0.5,
                release: 0.02
            },
            output: {
                volume: 0.5
            }

        };

        this.Noise = new Tone.Noise(this.params.noise.waveform);
        this.Envelope = new Tone.Envelope(this.params.envelope.attack, this.params.envelope.decay, this.params.envelope.sustain, this.params.envelope.release);
        this.OutputGain = this.Noise.context.createGain();
        this.OutputGain.gain.value = this.params.output.volume;

        this.Envelope.connect(this.Noise.output.gain);
        this.Noise.chain(this.Noise, this.OutputGain, this.OutputGain.context.destination); //TODO: Should connect to a master audio gain output with compression (in BlockView?)
        this.Noise.start();
    }

    MouseDown() {
        super.MouseDown();

        // play tone
        this.Envelope.triggerAttack();
    }

    MouseUp() {
        super.MouseUp();

        // stop tone
        this.Envelope.triggerRelease();

    }

    Update(ctx:CanvasRenderingContext2D) {
        super.Update(ctx);
    }

    // output blocks are blue circles
    Draw(ctx:CanvasRenderingContext2D) {
        super.Draw(ctx);

        ctx.beginPath();
        ctx.arc(this.Position.X, this.Position.Y, this.Radius, 0, Math.TAU, false);
        ctx.fillStyle = this.IsPressed || this.IsSelected ? "#7176e1" : "#000be6";
        ctx.fill();
    }
}

export = Noise;