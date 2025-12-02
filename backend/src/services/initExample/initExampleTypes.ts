/**
 * @summary
 * Type definitions for InitExample entity.
 *
 * @module services/initExample/initExampleTypes
 */

/**
 * @interface InitExampleMetadata
 * @description Nested object example for documentation pattern
 */
export interface InitExampleMetadata {
  category: string;
  priority: 'low' | 'medium' | 'high';
}

/**
 * @interface InitExampleEntity
 * @description Represents an init-example entity
 */
export interface InitExampleEntity {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  metadata: InitExampleMetadata;
  dateCreated: string;
  dateModified: string;
}

/**
 * @interface InitExampleCreateRequest
 * @description Request payload for creating an init-example
 */
export interface InitExampleCreateRequest {
  name: string;
  description: string | null;
  metadata?: InitExampleMetadata;
}

/**
 * @interface InitExampleUpdateRequest
 * @description Request payload for updating an init-example
 */
export interface InitExampleUpdateRequest {
  name: string;
  description: string | null;
  active: boolean;
  metadata?: InitExampleMetadata;
}

/**
 * @interface InitExampleListResponse
 * @description Response structure for listing init-examples
 */
export interface InitExampleListResponse {
  id: number;
  name: string;
  active: boolean;
  dateCreated: string;
}
