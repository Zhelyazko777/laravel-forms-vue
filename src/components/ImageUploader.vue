<template>
    <div id="image-uploader-container"
         class="w-100"
         @drop="onImagesDropped"
         @drag="stopDefaultDragAndDropBehaviour"
         @dragstart="stopDefaultDragAndDropBehaviour"
         @dragleave="stopDefaultDragAndDropBehaviour"
         @dragend="stopDefaultDragAndDropBehaviour"
         @dragover="stopDefaultDragAndDropBehaviour"
         @dragenter="stopDefaultDragAndDropBehaviour">

        <div class="w-100 h-100 d-flex flex-wrap position-relative nested-container">
            <div class="loading-spinner-container" v-if="loading">
                <loading-spinner/>
            </div>
            <div v-for="imageUrl in images" class="portfolio-image-container">
                <img :src="imageUrl.src" :srcset="imageUrl.srcSet">
                <div class="profile-image-overlay justify-content-center align-items-center flex-column">
                    <div class="text-center image-delete-container" @click="onImageRemove(imageUrl.id)">
                        <i class="fas fa-times"></i>
                        <p>{{tranlsations.imageUploaderDeleteImageText}}</p>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center align-items-center align-content-center flex-column w-100 mt-5 mb-5">
                <div class="image-icon-container">
                    <i class="fas fa-images"></i>
                </div>
                <p class="m-0 instructions-text">
                    {{tranlsations.imageUploaderInstructions}}
                    <span
                        class="upload-link"
                        @click="onPortfolioUploadClick">
                        {{tranlsations.imageUploaderClickToUploadText}}
                    </span>
                </p>
                <div class="errors mt-2">
                    <p v-if="error && error instanceof String" class="text-danger">{{error}}</p>
                    <p v-else v-for="err of error" class="text-danger mb-0">{{err}}</p>
                </div>

                <input type="file" hidden multiple ref="portfolioInput" @change="onImagesUpload">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
          return {
              images: [],
              loading: false,
              error: undefined,
              tranlsations: this.$laravelFormsConfig.componentTranslations,
          }
        },
        props: {
            value: {
                type: Array,
                default: () => [],
            },
            uploadRoute: {
                type: String,
            },
            loadRoute: {
                type: String,
            },
            removeRoute: {
                type: String,
            },
            supportedMimes: {
                type: Array,
                default: () => [],
            },
            maxImageFileSize: {
                type: Number,
            },
        },
        created () {
            if (this.loadRoute && this.loadRoute.length > 0) {
                this.loadImages();
            }
        },
        methods: {
            getHttpHeaders() {
                return {
                  'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                  'X-Requested-With': 'XMLHttpRequest',
                };
            },
            onPortfolioUploadClick () {
              this.$refs.portfolioInput.click();
            },
            onImagesDropped($event) {
                this.stopDefaultDragAndDropBehaviour($event);
                this.$emit('fileUpload', $event.dataTransfer.files);

                if (this.uploadRoute && this.uploadRoute.length > 0) {
                    this.uploadImages($event.dataTransfer.files)
                }
            },
            onImagesUpload ($event) {
                this.$emit('fileUpload', $event.target.files);

                if (this.uploadRoute && this.uploadRoute.length > 0) {
                    this.uploadImages($event.target.files)
                }
            },
            showImages (files) {
                const reader = new FileReader();
                reader.onload = (e) => {

                }
            },
            stopDefaultDragAndDropBehaviour ($event) {
                $event.preventDefault();
                $event.stopPropagation();
            },
            onImageRemove (imageId) {
                this.$emit('fileRemove', imageId);

                if (this.removeRoute && this.removeRoute.length > 0) {
                    this.removeImage(imageId);
                }
            },
            uploadImages (files) {
                files = Array.from(files);
                this.error = undefined;
                this.loading = true;
                let formData = new FormData();
                for (let file of files) {
                    formData.append('images[]', file, file.name);
                }

                fetch(this.uploadRoute, {
                    method: "POST",
                    headers: this.getHttpHeaders(),
                    body: formData,
                })
                    .then(response => response.json())
                    .then(result => {
                        this.loading = false;
                        if (result && result.images && result.images.length > 0) {
                            this.images = result.images;
                            this.$emit('input', this.images);
                        } else if (result &&
                            result.status === 'error' &&
                            result.userMessages) {
                            this.error = [];
                            const fields = Object.keys(result.userMessages);
                            for (const field of fields) {
                                result.userMessages[field].forEach(el => {
                                    this.error.push(el);
                                });
                            }
                            this.error = this.error
                                .filter((item, i, ar) => ar.indexOf(item) === i);
                        }
                    });
            },
            removeImage (imageId) {
                this.loading = true;
                const idPlaceholder = encodeURI('[itemId]');
                const url = this.removeRoute.replace(idPlaceholder, imageId);

                fetch(url, {
                    method: "POST",
                    headers: this.getHttpHeaders(),
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result && result.status === 'success' && result.imageId) {
                            this.images.splice(this.images.findIndex(x => x.id === imageId), 1);
                            this.$emit('input', this.images);
                        }
                        this.loading = false;
                    })
            },
            loadImages () {
                this.loading = true;
                fetch(this.loadRoute, {
                    method: "GET",
                    headers: this.getHttpHeaders(),
                })
                    .then(response => response.json())
                    .then(result => {
                        this.loading = false;
                        if (result && result.status === 'success' && result.images) {
                            this.images = result.images;
                            this.$emit('input', this.images);
                        }
                    })
            },
        },
    }
</script>

<style lang="scss" scoped>
@import './../scss/vue.scss';

    #image-uploader-container {
        border-radius: $default-border-radius;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: $secondary-color;
        min-height: 250px;

        @include md {
            min-height: 180px;
        }
        .nested-container {
            min-height: inherit;

            .image-icon-container i {
                font-size: 4rem;
            }
            .loading-spinner-container {
                position: absolute;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: white;
                opacity: .7;
                z-index: 10;
            }

            .portfolio-image-container {
                background-color: black;
                height: 180px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: calc(20% - 4px);
                position: relative;
                margin: 2px;

                @include md {
                    width: calc(33.3% - 4px);
                    max-width: none;
                    height: 100px;
                }
                img {
                    object-fit: contain;
                    width: 100%;
                    height: 100%;
                }
                .profile-image-overlay {
                    display: flex;
                    color: transparent;
                    background-color: transparent;
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 100%;

                    .image-delete-container {
                        cursor: pointer;

                        i {
                          font-size: 2rem;
                        }
                    }
                }

                &:hover > .profile-image-overlay  {
                    background-color: #0e130e8c;
                    color: white;
                    transition: background-color $transition-default, color $transition-default;
                }
            }

            .upload-link {
                text-decoration: underline;
                color: $primary-color;
                cursor: pointer;
            }
            .instructions-text {
                text-align: center;
                width: 90%;
                margin: 0 auto;

                @include md {
                    font-size: 13px;
                }
            }
            .errors {
                max-width: 80%;
                text-align: center;
            }
        }
    }

</style>
