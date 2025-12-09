export default class ArrayOperationResult {
    
    constructor() {
		
		this.added = [];
        this.noChange = [];
        this.removed = [];
		
		return this;
	}
	
	get changed() {
        return (this.added.length > 0 || this.removed.length > 0);
    }
}