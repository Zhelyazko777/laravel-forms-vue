<template>
    <div class="switch-container">
        <div class="slider">
            <div class="d-flex align-items-center justify-content-around h-100">
                <div @click="onLeftSideClick"
                     :class="selectOptions[0].value === binding? 'active-tab' : ''"
                     class="left">
                    {{ selectOptions[0].text }}
                </div>
                <div @click="onRightSideClick"
                     :class="selectOptions[1].value === binding ? 'active-tab' : ''"
                     class="right">
                    {{ selectOptions[1].text }}
                </div>
            </div>
            <div class="active" :class="activeSideClass"></div>
        </div>

        <select :name="name" hidden>
            <option v-for="option in selectOptions"
                    :value="option.value"
                    :selected="binding === option.value">
                {{ option.text }}
            </option>
        </select>

        <div v-if="hasSlots" class="slider-container">
            <div class="left-slot" :class="selectOptions[0].value === binding? 'active' : ''">
                <slot name="left"></slot>
            </div>
            <div class="right-slot" :class="selectOptions[1].value === binding? 'active' : ''">
                <slot name="right"></slot>
            </div>
        </div>
    </div>
</template>

<script>
import FormInputMixin from './../mixins/form-input-mixin';

export default {
    data() {
        return {
            selectOptions: [...this.options]
        }
    },
    mixins: [
      FormInputMixin,
    ],
    props: {
        options: {
            type: Array,
            default: () => [],
        }
    },
    computed: {
        hasSlots() {
            return Object.keys(this.$slots).length > 0;
        },
        activeSideClass () {
            return this.selectOptions[0].value === this.binding ? 'left' : 'right';
        }
    },
    methods: {
        onLeftSideClick () {
            this.binding = this.selectOptions[0].value;
        },
        onRightSideClick () {
            this.binding = this.selectOptions[1].value;
        }
    }
}
</script>

<style lang="scss" scoped>
@import './../scss/vue.scss';
    .switch-container {
        .slider {
            background-color: $secondary;
            width: 100%;
            border-radius: 22px;
            height: 45px;
            position: relative;

            .left, .right {
                position: relative;
                z-index: 2;
                background-color: transparent;
                text-align: center;
                cursor: pointer;
                transition: color .5s;
                user-select: none;

                @include md {
                    font-size: 13px;
                }

                &.active-tab {
                    color: white;
                }
            }
            .left {
                width: 50%;
                border-radius: 22px;
            }
            .right {
                width: 50%;
                border-radius: 22px;
            }
            .active {
                position: absolute;
                top: 0;
                left: 0;
                background-color: $primary;
                border-radius: 22px;
                width: 50%;
                height: 100%;
                color: white;
                filter: drop-shadow(1px 2px 2px rgba(0, 0, 0, 0.25));
                transition: all .5s;
                z-index: 1;

                &.left {
                    transform: translateX(0);
                }
                &.right {
                    transform: translateX(100%);
                }
            }
        }

        .slider-container {
            display: flex;
            flex-wrap: nowrap;
            overflow: hidden;

            .left-slot, .right-slot {
                width: 100%;
                flex-shrink: 0;
            }
            .left-slot {
                width: 100%;
                animation: slideLeftInactive .5s;
                transform: translateX(-110%);
                opacity: 0;
                visibility: hidden;
                height: 0;

                &.active {
                    animation: slideLeftActive .5s;
                    transform: translateX(0);
                    opacity: 1;
                    visibility: visible;
                    height: auto;
                }
            }
            .right-slot {
                width: 100%;
                transform: translateX(100%);
                animation: slideRightInactive .5s;
                opacity: 0;
                visibility: hidden;
                height: 0;

                &.active {
                    transform: translateX(-100%);
                    animation: slideRightActive .5s;
                    opacity: 1;
                    visibility: visible;
                    height: auto;
                }
            }
        }
    }

    @keyframes slideLeftActive {
        from {
            opacity: 0;
            visibility: hidden;
            height: 0;
            transform: translateX(-110%);
        }
        to {
            opacity: 1;
            visibility: visible;
            height: auto;
            transform: translateX(0%);
        }
    }

    @keyframes slideLeftInactive {
        from {
            opacity: 1;
            visibility: visible;
            height: auto;
            transform: translateX(0%);
        }
        to {
            opacity: 0;
            visibility: hidden;
            height: 0;
            transform: translateX(-110%);
        }
    }

    @keyframes slideRightActive {
        from {
            opacity: 0;
            visibility: hidden;
            height: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            visibility: visible;
            height: auto;
            transform: translateX(-100%);
        }
    }

    @keyframes slideRightInactive {
        from {
            opacity: 1;
            visibility: visible;
            height: auto;
            transform: translateX(-100%);
        }
        to {
            opacity: 0;
            visibility: hidden;
            height: 0;
            transform: translateX(100%);
        }
    }
</style>
